import React, { useState, useEffect } from 'react';
import { Modal, Button as AntButton, Input, Select, DatePicker, message } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;

const periodOptions = [
	{ value: 'one-time', label: 'One Time' },
	{ value: '15-days', label: '15 Days' },
	{ value: '1-month', label: '1 Month' },
	{ value: '3-months', label: '3 Months' },
	{ value: '6-months', label: '6 Months' },
	{ value: '1-year', label: '1 Year' }
];

export default function EditScheduledRideModal({ open, onClose, ride, onSave }) {
	const [scheduleStartDate, setScheduleStartDate] = useState(ride?.scheduleStartDate ? dayjs(ride.scheduleStartDate) : null);
	const [schedulePeriod, setSchedulePeriod] = useState(ride?.schedulePeriod || 'one-time');
	const [saving, setSaving] = useState(false);
	const [fare, setFare] = useState(ride?.fare || 0);

	useEffect(() => {
		async function fetchFare() {
			if (!ride) return;
			try {
				const res = await fetch(`${import.meta.env.VITE_BASE_URL || 'http://localhost:4000'}/rides/get-fare?pickup=${encodeURIComponent(ride.pickup)}&destination=${encodeURIComponent(ride.destination)}`);
				const data = await res.json();
				const periodMultipliers = {
					'one-time': 1,
					'15-days': 14,
					'1-month': 30,
					'3-months': 90,
					'6-months': 180,
					'1-year': 365
				};
				const periodDiscounts = {
					'one-time': 0,
					'15-days': 0.10,
					'1-month': 0.15,
					'3-months': 0.20,
					'6-months': 0.25,
					'1-year': 0.30
				};
				const multiplier = periodMultipliers[schedulePeriod] || 1;
				const discount = periodDiscounts[schedulePeriod] || 0;
				const baseFare = data.fare?.[ride.vehicleType] || 0;
				setFare(Math.round(baseFare * multiplier * (1 - discount)));
			} catch {
				setFare(0);
			}
		}
		fetchFare();
	}, [schedulePeriod, scheduleStartDate, ride]);

	const handleSave = async () => {
		setSaving(true);
		try {
			const token = localStorage.getItem('token');
			const res = await fetch(`${import.meta.env.VITE_BASE_URL || 'http://localhost:4000'}/rides/${ride._id}/edit-schedule`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`
				},
				credentials: 'include',
				body: JSON.stringify({
					scheduleStartDate: scheduleStartDate ? scheduleStartDate.toISOString() : null,
					schedulePeriod
				})
			});
			if (res.ok) {
				const updated = await res.json();
				onSave(updated.ride);
				onClose();
				message.success('Schedule updated!');
			} else {
				message.error('Failed to update schedule');
			}
		} catch {
			message.error('Failed to update schedule');
		}
		setSaving(false);
	};

	if (!open || !ride) return null;

	return (
		<Modal
			open={open}
			title="Edit Scheduled Ride"
			onCancel={onClose}
			onOk={handleSave}
			okText={saving ? 'Saving...' : 'Save Changes'}
			confirmLoading={saving}
			destroyOnClose
		>
			<div className="space-y-4">
				<div>
					<label className="block mb-1 font-medium">Date & Time</label>
					<DatePicker
						showTime
						value={scheduleStartDate}
						onChange={setScheduleStartDate}
						className="w-full"
						format="YYYY-MM-DD HH:mm"
					/>
				</div>
				<div>
					<label className="block mb-1 font-medium">Schedule Period</label>
					<Select
						value={schedulePeriod}
						onChange={setSchedulePeriod}
						className="w-full"
					>
						{periodOptions.map(opt => <Option key={opt.value} value={opt.value}>{opt.label}</Option>)}
					</Select>
				</div>
				<div>
					<label className="block mb-1 font-medium">Fare</label>
					<div className="font-bold text-lg text-primary">₹{fare}</div>
				</div>
			</div>
		</Modal>
	);
}

"use client"; 

import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, message, Modal, Form, Input, DatePicker, Select, Upload } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import Link from 'next/link';
import 'dayjs/locale/en-gb'; 
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const AdminMatchesPage = () => {
    const [matches, setMatches] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    const [editMatch, setEditMatch] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchMatches = async () => {
            try {
                const response = await fetch('/api/matches');
                if (!response.ok) {
                    throw new Error('Failed to fetch matches');
                }
                const data = await response.json();
                setMatches(data);
            } catch (error) {
                console.error('Error fetching matches:', error);
            }
        };

        fetchMatches();
    }, []);

    const handleEdit = (record) => {
        setEditMatch(record);
        form.setFieldsValue({
            teamA: record.teamA,
            teamB: record.teamB,
            status: record.status,
            videoUrl: record.videoUrl,
            matchDate: record.matchDate ? dayjs(record.matchDate) : null,
            tournament: record.tournament,
            teamAImg: record.teamAImg,
            teamBImg: record.teamBImg,
        });
        setIsModalVisible(true);
    };

  

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/matches/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete match');
            }
            setMatches(matches.filter((match) => match._id !== id));
            message.success('Match deleted successfully');
        } catch (error) {
            console.error('Error deleting match:', error);
            message.error('Failed to delete match');
        }
    };

    const handleUpdate = async (values) => {
        try {
            const response = await fetch(`/api/matches/${editMatch._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({
                    ...values,
                    matchDate: values.matchDate ? values.matchDate.toISOString() : null,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to update match');
            }
            const updatedMatch = await response.json();
            setMatches(matches.map(match => (match._id === updatedMatch._id ? updatedMatch : match)));
            message.success('Match updated successfully');
            setIsModalVisible(false);
        } catch (error) {
            console.error('Error updating match:', error);
            message.error('Failed to update match');
        }
    };

    

    const columns = [
        {
            title: 'Team A',
            dataIndex: 'teamA',
            key: 'teamA',
        },
        {
            title: 'Team B',
            dataIndex: 'teamB',
            key: 'teamB',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Match Date',
            dataIndex: 'matchDate',
            key: 'matchDate',
            render: (text) => text ? dayjs(text).format('YYYY-MM-DD HH:mm:ss') : '',
        },
        {
            title: 'Tournament',
            dataIndex: 'tournament',
            key: 'tournament',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <span>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEdit(record)}
                        style={{ marginRight: 8 }}
                    >
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this match?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button icon={<DeleteOutlined />} danger>
                            Delete
                        </Button>
                    </Popconfirm>
                </span>
            ),
        },
    ];

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div style={{ width: '80%', maxWidth: '1200px' }}>
                <h1>Admin Matches Page</h1>
                <Link href="/admin/matches/add">
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    style={{ marginBottom: 16 }}

                >
                    Add Match
                </Button>
                </Link>
                <Table dataSource={matches} columns={columns} rowKey="_id" />

                <Modal
                    title={"Edit Match"}
                    visible={isModalVisible}
                    onCancel={() => {
                        setIsModalVisible(false);
                    }}
                    footer={null}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={ handleUpdate}
                        initialValues={{
                            status: editMatch?.status,
                            matchDate: editMatch?.matchDate ? dayjs(editMatch.matchDate) : null,
                            teamAImg: editMatch?.teamAImg,
                            teamBImg: editMatch?.teamBImg,
                        }}
                    >
                        <Form.Item name="teamA" label="Team A" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="teamB" label="Team B" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="status" label="Status" rules={[{ required: true }]}>
                            <Select>
                                <Option value="in-time">In Time</Option>
                                <Option value="live">Live</Option>
                                <Option value="end">End</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item name="videoUrl" label="Video URL">
                            <Input />
                        </Form.Item>
                        <Form.Item name="matchDate" label="Match Date">
                            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                        </Form.Item>
                        <Form.Item name="tournament" label="Tournament" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="teamAImg" label="Team A Image">
                            <Input />
                        </Form.Item>
                        <Form.Item name="teamBImg" label="Team B Image">
                            <Input />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                {"Update"}
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
};

export default AdminMatchesPage;

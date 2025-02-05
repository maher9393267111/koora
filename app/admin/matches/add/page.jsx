"use client";

import React, { useState } from 'react';
import { Form, Input, Button, Select, DatePicker, Upload, Row, Col, message } from 'antd';
import { useRouter } from 'next/navigation';
import { UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Option } = Select;

const AddMatchPage = () => {
  const [teamAImg, setTeamAImg] = useState(null);
  const [teamBImg, setTeamBImg] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values) => {
    setLoading(true);

    const formData = new FormData();
    formData.append('teamA', values.teamA);
    formData.append('teamB', values.teamB);
    formData.append('status', values.status);
    formData.append('videoUrl', values.videoUrl);
    formData.append('matchDate', dayjs(values.matchDate).format('YYYY-MM-DD'));
    formData.append('tournament', values.tournament);

    if (teamAImg) {
      formData.append('teamAImg', teamAImg);
    }
    if (teamBImg) {
      formData.append('teamBImg', teamBImg);
    }

    try {
      const response = await fetch('/api/matches', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        message.success('Match added successfully!');
        router.push('/admin/matches');
      } else {
        const { message: errorMessage } = await response.json();
        message.error(errorMessage);
      }
    } catch (error) {
      message.error('Failed to add match. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (file, setImage) => {
    setImage(file);
    return false;
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Form
        layout="vertical"
        style={{ width: '100%', maxWidth: 600 }}
        onFinish={handleSubmit}
        encType="multipart/form-data"
      >
        <h1 style={{ textAlign: 'center', marginBottom: 30 }}>Add New Match</h1>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Team A"
              name="teamA"
              rules={[{ required: true, message: 'Please input Team A name' }]}
            >
              <Input placeholder="Enter Team A" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Team B"
              name="teamB"
              rules={[{ required: true, message: 'Please input Team B name' }]}
            >
              <Input placeholder="Enter Team B" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Team A Image">
              <Upload
                beforeUpload={(file) => handleImageUpload(file, setTeamAImg)}
                showUploadList={false}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />}>Upload Team A Image</Button>
              </Upload>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Team B Image">
              <Upload
                beforeUpload={(file) => handleImageUpload(file, setTeamBImg)}
                showUploadList={false}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />}>Upload Team B Image</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: 'Please select match status' }]}
            >
              <Select placeholder="Select status">
                <Option value="in-time">In Time</Option>
                <Option value="live">Live</Option>
                <Option value="end">End</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Video URL" name="videoUrl">
              <Input placeholder="Enter Video URL" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Match Date"
              name="matchDate"
              rules={[{ required: true, message: 'Please select match date' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Tournament"
              name="tournament"
              rules={[{ required: true, message: 'Please input tournament name' }]}
            >
              <Input placeholder="Enter Tournament Name" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} style={{ width: '100%' }}>
            Add Match
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddMatchPage;

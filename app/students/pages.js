"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Popconfirm,
  message,
  Spin,
} from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";

const API_URL = "/api/students";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [form] = Form.useForm();
  const router = useRouter();

  // ✅ Fetch students
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setStudents(res.data);
    } catch (error) {
      console.error("Fetch Error:", error);
      message.error("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ✅ Open modal for add/edit
  const openModal = (student = null) => {
    setEditingStudent(student);
    form.resetFields();
    if (student) form.setFieldsValue(student);
    setIsModalOpen(true);
  };

  // ✅ Add or Update
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingStudent) {
        // Update
        await axios.put(API_URL, { id: editingStudent.id, ...values });
        message.success("Student updated successfully");
      } else {
        // Add
        await axios.post(API_URL, values);
        message.success("Student added successfully");
      }
      setIsModalOpen(false);
      fetchStudents();
    } catch (error) {
      console.error("Save Error:", error);
      message.error("Failed to save student");
    }
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    try {
      await axios.delete(API_URL, { data: { id } });
      message.success("Student deleted successfully");
      fetchStudents();
    } catch (error) {
      console.error("Delete Error:", error);
      message.error("Failed to delete student");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", width: 60 },
    { title: "NIS", dataIndex: "nis" },
    { title: "Name", dataIndex: "name" },
    { title: "Class", dataIndex: "class_name" },
    { title: "Major", dataIndex: "major" },
    { title: "Status", dataIndex: "status" },
    {
      title: "Action",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => openModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger type="link">
              Delete
            </Button>
          </Popconfirm>
          <Button
            type="link"
            onClick={() => router.push(`/students/${record.id}`)}
          >
            View Detail
          </Button>
        </>
      ),
    },
  ];

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: 50 }}>
        <Spin size="large" />
      </div>
    );

  return (
    <div style={{ padding: 24 }}>
      <h1>Student Management</h1>
      <Button
        type="primary"
        onClick={() => openModal()}
        style={{ marginBottom: 20 }}
      >
        Add Student
      </Button>

      <Table
        columns={columns}
        dataSource={students}
        rowKey="id"
        bordered
        pagination={{ pageSize: 6 }}
      />

      {/* ✅ Modal for Add/Edit */}
      <Modal
        title={editingStudent ? "Edit Student" : "Add Student"}
        open={isModalOpen}
        onOk={handleSubmit}
        onCancel={() => setIsModalOpen(false)}
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="nis"
            label="NIS"
            rules={[{ required: true, message: "Please input NIS" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="class_name"
            label="Class"
            rules={[{ required: true, message: "Please input class" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="major"
            label="Major"
            rules={[{ required: true, message: "Please input major" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: "Please input status" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

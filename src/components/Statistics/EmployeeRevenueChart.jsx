import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import axiosInstance from '../../utils/axiosConfig';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const EmployeeRevenueChart = ({ data }) => {
  const [employeesWithNames, setEmployeesWithNames] = useState([]);

  useEffect(() => {
    const fetchEmployeeNames = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          console.error('No access token found');
          return;
        }

        // Lấy thông tin tên nhân viên cho từng employeeId
        const employeesData = await Promise.all(
          data.map(async (item) => {
            try {
              const response = await axiosInstance.get('/users', {
                params: { 
                  id: item.employeeId
                },
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json'
                }
              });

              if (response.data?.data?.items && response.data.data.items.length > 0) {
                const employee = response.data.data.items[0];
                return {
                  ...item,
                  employeeName: employee.name || employee.email
                };
              }
              return {
                ...item,
                employeeName: `NV${item.employeeId}`
              };
            } catch (error) {
              console.error(`Error fetching employee name for ID ${item.employeeId}:`, error);
              return {
                ...item,
                employeeName: `NV${item.employeeId}`
              };
            }
          })
        );

        setEmployeesWithNames(employeesData);
      } catch (error) {
        console.error('Error fetching employee names:', error);
        // Nếu có lỗi, vẫn hiển thị dữ liệu với ID
        const fallbackData = data.map(item => ({
          ...item,
          employeeName: `NV${item.employeeId}`
        }));
        setEmployeesWithNames(fallbackData);
      }
    };

    if (data && data.length > 0) {
      fetchEmployeeNames();
    }
  }, [data]);

  // Sắp xếp data theo doanh thu giảm dần
  const sortedData = [...employeesWithNames].sort((a, b) => b.totalRevenue - a.totalRevenue);

  const chartData = {
    labels: sortedData.map(item => item.employeeName),
    datasets: [
      {
        label: 'Doanh thu',
        data: sortedData.map(item => item.totalRevenue),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        borderColor: 'rgb(53, 162, 235)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Doanh thu theo nhân viên',
      },
      tooltip: {
        callbacks: {
          title: function(context) {
            const item = sortedData[context[0].dataIndex];
            return item.employeeName;
          },
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND'
            }).format(context.parsed.y);
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND'
            }).format(value);
          }
        }
      }
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default EmployeeRevenueChart; 
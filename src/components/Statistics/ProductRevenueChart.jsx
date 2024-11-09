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

const ProductRevenueChart = ({ data }) => {
  const [productsWithNames, setProductsWithNames] = useState([]);

  useEffect(() => {
    const fetchProductNames = async () => {
      try {
        // Lấy thông tin tên sản phẩm cho từng productId
        const productsData = await Promise.all(
          data.map(async (item) => {
            try {
              const response = await axiosInstance.get('/products/getproduct & pagging', {
                params: { id: item.productId }
              });

              if (response.data && response.data.items && response.data.items.length > 0) {
                return {
                  ...item,
                  productName: response.data.items[0].productName
                };
              }
              return item;
            } catch (error) {
              console.error(`Error fetching product name for ID ${item.productId}:`, error);
              return item;
            }
          })
        );

        setProductsWithNames(productsData);
      } catch (error) {
        console.error('Error fetching product names:', error);
        setProductsWithNames(data);
      }
    };

    fetchProductNames();
  }, [data]);

  // Sắp xếp data theo doanh thu giảm dần và lấy top 10
  const sortedData = [...productsWithNames]
    .sort((a, b) => b.totalRevenue - a.totalRevenue)
    .slice(0, 10);

  const chartData = {
    labels: sortedData.map(item => item.productName || `SP${item.productId}`),
    datasets: [
      {
        label: 'Doanh thu',
        data: sortedData.map(item => item.totalRevenue),
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgb(75, 192, 192)',
        borderWidth: 1,
        yAxisID: 'y',
      },
      {
        label: 'Số lượng bán',
        data: sortedData.map(item => item.totalQuantity),
        backgroundColor: 'rgba(255, 159, 64, 0.5)',
        borderColor: 'rgb(255, 159, 64)',
        borderWidth: 1,
        yAxisID: 'y1',
      }
    ],
  };

  const options = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Top 10 sản phẩm theo doanh thu',
      },
      tooltip: {
        callbacks: {
          title: function(context) {
            const item = sortedData[context[0].dataIndex];
            return item.productName || `SP${item.productId}`;
          },
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.datasetIndex === 0) {
              // Format doanh thu
              label += new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(context.parsed.y);
            } else {
              // Format số lượng
              label += new Intl.NumberFormat('vi-VN').format(context.parsed.y) + ' sản phẩm';
            }
            return label;
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Doanh thu (VNĐ)'
        },
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND'
            }).format(value);
          }
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Số lượng bán'
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('vi-VN').format(value);
          }
        }
      },
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

export default ProductRevenueChart; 
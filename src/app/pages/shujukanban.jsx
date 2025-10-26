import React, { Component } from 'react';
import { Button } from 'antd';
import './shujukanban.scss';
import { Doughnut } from 'react-chartjs-2';
import request from '../../api/request';


const data = {
    labels: ['Red', 'Green', 'Blue'],
    datasets: [
        {
            label: 'Dataset',
            data: [30, 50, 20],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        },
    ],
};

const options = {
    responsive: true, // 响应式
    maintainAspectRatio: false, // 禁用默认宽高比
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'My Doughnut Chart',
        },
    },
};


export class Shujukanban extends Component {
    render() {
        return (
            <div class="shujukanban">
                <div class="box">
                    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <Doughnut data={data} options={options} />
                    </div>
                </div>
                <div class="box"></div>
                <div class="box"></div>
                <div class="box"></div>
            </div>
        )
    }
}

export default Shujukanban;

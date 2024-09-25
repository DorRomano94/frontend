import React from 'react';
import { useParams } from 'react-router-dom';
import { Layout, Typography, Card, Spin, Alert } from 'antd';
import { useFetch } from '../hooks/useFetch';
import authStore from '../stores/authStore';

const { Content } = Layout;

const SymbolDetailsPage: React.FC = () => {
    const { symbol } = useParams<{ symbol: string }>();
    const { data: stockInfo, loading, error } = useFetch(`/stocks/info?symbol=${symbol}`, authStore.isAuthenticated);

    const getChangeColor = (changesPercentage: number) => {
        return changesPercentage > 0 ? 'green' : changesPercentage < 0 ? 'red' : 'black';
    };

    return (
        <Layout>
            <Typography.Title level={2}>{symbol} Details</Typography.Title>
            <Content style={{ padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                {loading ? (
                    <Spin size="large" />
                ) : error ? (
                    <Alert message={error} type="error" showIcon />
                ) : (
                    <Card title={`Details for ${symbol}`} style={{ width: 400, textAlign: 'left' }}>
                        {stockInfo ? (
                            <ul>
                                <li><strong>Current Price:</strong> {stockInfo.price}</li>
                                <li><strong>Previous Close Price:</strong> {stockInfo.previousClose}</li>
                                <li>
                                    <strong>
                                        Changes Percentage:
                                        <span style={{ color: getChangeColor(stockInfo.changesPercentage) }}>
                                            {" "}{stockInfo.changesPercentage}%
                                        </span>
                                    </strong>
                                </li>
                            </ul>
                        ) : (
                            <Typography>No information available for this symbol.</Typography>
                        )}
                    </Card>
                )}
            </Content>
        </Layout>
    );
};

export default SymbolDetailsPage;

import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Layout, Typography, Select, Button, message, Input, List, Spin, Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';
import authStore from '../stores/authStore';
import { useFetch } from '../hooks/useFetch';
import { useDebounce } from '../hooks/useDebounce';
import axiosInstance from '../axiosInstance';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Option } = Select;
const { Search } = Input;

const PortfolioPage: React.FC = observer(() => {
    const navigate = useNavigate();
    const [selectedSymbol, setSelectedSymbol] = useState<string | undefined>(undefined);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const debouncedSearchTerm = useDebounce(searchTerm, 200);

    // Loading states for add and remove actions
    const [isAdding, setIsAdding] = useState<boolean>(false);
    const [isRemoving, setIsRemoving] = useState<string | null>(null);

    // Fetch available stock symbols
    const { data: symbols = [], loading: symbolsLoading, error: symbolsError } = useFetch('/stocks/symbols', authStore.isAuthenticated);

    // Fetch user's portfolio
    const { data: portfolio, loading: portfolioLoading, error: portfolioError } = useFetch('/users/me/portfolio', authStore.isAuthenticated);

    useEffect(() => {
        if (portfolio) {
            setFavorites(portfolio);
        }
    }, [portfolio]);

    const handleSave = async () => {
        if (!selectedSymbol) {
            message.warning('Please select a symbol to add.');
            return;
        }
        setIsAdding(true);
        try {
            await axiosInstance.put('/users/portfolio/add', { item: selectedSymbol });
            message.success('Symbol added to portfolio!');
            setFavorites((prev) => [...prev, selectedSymbol]);
        } catch (error) {
            message.error('Failed to add symbol to portfolio.');
        } finally {
            setIsAdding(false);
        }
    };

    const handleRemove = async (symbol: string) => {
        setIsRemoving(symbol);
        try {
            await axiosInstance.put('/users/portfolio/remove', { item: symbol });
            message.success('Symbol removed from portfolio!');
            setFavorites((prev) => prev.filter((fav) => fav !== symbol));
        } catch (error) {
            message.error('Failed to remove symbol from portfolio.');
        } finally {
            setIsRemoving(null);
        }
    };

    // Filter favorites based on the debounced search term
    const filteredFavorites = favorites.filter((symbol) =>
        symbol.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 6) {
            return 'Good Night';
        } else if (hour < 12) {
            return 'Good Morning';
        } else if (hour < 18) {
            return 'Good Afternoon';
        } else {
            return 'Good Evening';
        }
    };

    return (
        <Layout style={{ height: '100%' }}>
            <Typography.Title level={2}>
                {getGreeting()} {authStore.user?.name || 'User'}
            </Typography.Title>
            <Content>
                {symbolsError ? (
                    <Typography.Text type="danger">{symbolsError}</Typography.Text>
                ) : (
                    <>
                        <Typography>Add to favorites:</Typography>
                        <Select
                            placeholder="Select a symbol"
                            style={{ width: 200 }}
                            showSearch
                            loading={symbolsLoading}
                            onChange={setSelectedSymbol}
                        >
                            {symbolsLoading ? (
                                <Option value="" disabled>
                                    <Spin size="small" /> Loading...
                                </Option>
                            ) : (
                                symbols?.map((symbol: string) => (
                                    <Option key={symbol} value={symbol}>
                                        {symbol}
                                    </Option>
                                ))
                            )}
                        </Select>
                        <Button
                            type="primary"
                            onClick={handleSave}
                            style={{ marginLeft: '20px' }}
                            loading={isAdding}
                        >
                            Save
                        </Button>
                    </>
                )}

                <Typography.Title level={4} style={{ marginTop: '5px' }}>Your Favorites:</Typography.Title>
                {portfolioLoading ? (
                    <Spin size="large" style={{ display: 'block', margin: '5px auto' }} />
                ) : portfolioError ? (
                    <Typography.Text type="danger">{portfolioError}</Typography.Text>
                ) : (
                    <>
                        <Search
                            placeholder="Search favorites"
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: 300, marginBottom: '5px' }}
                        />

                        <List
                            bordered
                            dataSource={filteredFavorites}
                            renderItem={(symbol) => (
                                <List.Item
                                    key={symbol}
                                    actions={[
                                        <Tooltip title="Remove from portfolio">
                                            <DeleteOutlined
                                                onClick={() => handleRemove(symbol)}
                                                style={{ color: 'red' }}
                                            />
                                            {isRemoving === symbol && <Spin size="small" style={{ marginLeft: '5px' }} />} {/* Show loading spinner next to Delete icon */}
                                        </Tooltip>,
                                        <Tooltip title="View details">
                                            <EyeOutlined onClick={() => navigate(`/symbol/${symbol}`)} style={{ color: 'blue' }} />
                                        </Tooltip>
                                    ]}
                                >
                                    {symbol}
                                </List.Item>
                            )}
                            style={{ maxHeight: '60%', overflowY: 'auto' }}
                        />
                    </>
                )}
            </Content>
        </Layout>
    );
});

export default PortfolioPage;

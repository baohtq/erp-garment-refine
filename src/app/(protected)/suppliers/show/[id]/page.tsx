"use client";

import React, { useState, useEffect, use } from "react";
import { useShow, useGo, useList, useMany } from "@refinedev/core";
import { Status } from '@/utils/supabase/constants';
import { Supplier, SupplierTransaction, SupplierRating, SupplierContract, SupplierContractPayment } from "@/types/db";
import { supabaseBrowserClient } from '@/utils/supabase/client';
import { format } from "date-fns";
import { vi } from "date-fns/locale";

// Import mock data
import { 
  mockSuppliers, 
  mockSupplierTransactions, 
  mockSupplierRatings, 
  mockSupplierContracts,
  mockSupplierContractPayments,
  getSupplierById,
  getTransactionsBySupplier,
  getRatingsBySupplier,
  getContractsBySupplier,
  getPaymentsByContract
} from "@/mock/suppliers";
import { SupplierTransactionForm, SupplierRatingForm, SupplierContractForm, SupplierContractPaymentForm } from "@/components/suppliers";

export default function SupplierShow(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const go = useGo();
  const [activeTab, setActiveTab] = useState("info");
  const [useMockData, setUseMockData] = useState(false);

  // Modal states
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);

  // Mock data
  const [mockSupplier, setMockSupplier] = useState<Supplier | null>(null);
  const [mockTransactionsData, setMockTransactionsData] = useState<SupplierTransaction[]>([]);
  const [mockRatingsData, setMockRatingsData] = useState<SupplierRating[]>([]);
  const [mockContractsData, setMockContractsData] = useState<SupplierContract[]>([]);
  const [mockPaymentsData, setMockPaymentsData] = useState<SupplierContractPayment[]>([]);

  useEffect(() => {
    // Cố gắng tải dữ liệu từ cơ sở dữ liệu, nếu không có sẽ sử dụng dữ liệu giả
    const loadData = async () => {
      try {
        const { data: supplier } = await supabaseBrowserClient
          .from('suppliers')
          .select('*')
          .eq('id', params.id)
          .single();
          
        // Nếu không tìm thấy nhà cung cấp trong database, sử dụng mock data
        if (!supplier) {
          setUseMockData(true);
          const mockSupplier = getSupplierById(params.id);
          if (mockSupplier) {
            setMockSupplier(mockSupplier);
            setMockTransactionsData(getTransactionsBySupplier(params.id));
            setMockRatingsData(getRatingsBySupplier(params.id));
            setMockContractsData(getContractsBySupplier(params.id));
            
            // Load mock payments cho tất cả contracts
            const contracts = getContractsBySupplier(params.id);
            const allPayments: SupplierContractPayment[] = [];
            contracts.forEach(contract => {
              const payments = getPaymentsByContract(contract.id);
              allPayments.push(...payments);
            });
            setMockPaymentsData(allPayments);
          }
        }
      } catch (error) {
        console.error("Error fetching supplier:", error);
        setUseMockData(true);
        // Sử dụng mock data khi có lỗi
        const mockSupplier = getSupplierById(params.id);
        if (mockSupplier) {
          setMockSupplier(mockSupplier);
          setMockTransactionsData(getTransactionsBySupplier(params.id));
          setMockRatingsData(getRatingsBySupplier(params.id));
          setMockContractsData(getContractsBySupplier(params.id));
          
          // Load mock payments cho tất cả contracts
          const contracts = getContractsBySupplier(params.id);
          const allPayments: SupplierContractPayment[] = [];
          contracts.forEach(contract => {
            const payments = getPaymentsByContract(contract.id);
            allPayments.push(...payments);
          });
          setMockPaymentsData(allPayments);
        }
      }
    };
    
    loadData();
  }, [params.id]);

  const { queryResult } = useShow<Supplier>({
    resource: "suppliers",
    id: params.id,
  });

  const { data: transactionsData } = useList<SupplierTransaction>({
    resource: "supplier_transactions",
    filters: [
      {
        field: "supplier_id",
        operator: "eq",
        value: params.id,
      },
    ],
    sorters: [
      {
        field: "transaction_date",
        order: "desc",
      },
    ],
  });

  const { data: ratingsData } = useList<SupplierRating>({
    resource: "supplier_ratings",
    filters: [
      {
        field: "supplier_id",
        operator: "eq",
        value: params.id,
      },
    ],
    sorters: [
      {
        field: "rating_date",
        order: "desc",
      },
    ],
  });

  const { data: contractsData } = useList<SupplierContract>({
    resource: "supplier_contracts",
    filters: [
      {
        field: "supplier_id",
        operator: "eq",
        value: params.id,
      },
    ],
    sorters: [
      {
        field: "created_at",
        order: "desc",
      },
    ],
  });

  const contractIds = contractsData?.data?.map((contract) => contract.id) || [];

  const { data: paymentsData } = useMany<SupplierContractPayment>({
    resource: "supplier_contract_payments",
    ids: contractIds,
    queryOptions: {
      enabled: contractIds.length > 0,
    },
  });

  const { data, isLoading, isError } = queryResult;

  // Decide whether to use mock data or real data
  const supplier = useMockData ? mockSupplier : data?.data;
  const transactions = useMockData ? mockTransactionsData : (transactionsData?.data || []);
  const ratings = useMockData ? mockRatingsData : (ratingsData?.data || []);
  const contracts = useMockData ? mockContractsData : (contractsData?.data || []);
  const payments = useMockData ? mockPaymentsData : (paymentsData?.data || []);

  // Tính điểm trung bình đánh giá
  const calculateAverageRating = () => {
    if (!ratings || ratings.length === 0) return 0;
    
    const totalOverall = ratings.reduce((sum, rating) => sum + rating.overall_score, 0);
    return totalOverall / ratings.length;
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
    } catch (error) {
      return dateString;
    }
  };

  // Handle form submission success
  const handleFormSuccess = () => {
    // Đóng các modal
    setShowTransactionModal(false);
    setShowRatingModal(false);
    setShowContractModal(false);
    setShowPaymentModal(false);
    
    // Thông báo thành công
    alert("Đã lưu thành công!");
  };

  if (isLoading && !useMockData) {
    return <div>Đang tải...</div>;
  }

  if (isError && !useMockData) {
    return <div>Lỗi khi tải dữ liệu</div>;
  }

  if (!supplier && !useMockData) {
    return <div>Không tìm thấy nhà cung cấp</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Chi tiết nhà cung cấp</h1>
        <div className="flex gap-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => go({ to: `/suppliers/edit/${params.id}` })}
          >
            Chỉnh sửa
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => go({ to: "/suppliers" })}
          >
            Quay lại
          </button>
          {useMockData && (
            <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs flex items-center">
              Đang dùng dữ liệu mẫu
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                activeTab === "info"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("info")}
            >
              Thông tin cơ bản
            </button>
            <button
              className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                activeTab === "transactions"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("transactions")}
            >
              Lịch sử giao dịch
            </button>
            <button
              className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                activeTab === "ratings"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("ratings")}
            >
              Đánh giá
            </button>
            <button
              className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                activeTab === "contracts"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
              onClick={() => setActiveTab("contracts")}
            >
              Hợp đồng & Thanh toán
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        {activeTab === "info" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="info-group">
              <h3 className="text-lg font-semibold mb-2">Thông tin cơ bản</h3>
              <div className="p-4 bg-gray-50 rounded">
                <div className="mb-3">
                  <span className="font-medium text-gray-700">Mã nhà cung cấp:</span>
                  <span className="ml-2">{supplier?.code}</span>
                </div>
                <div className="mb-3">
                  <span className="font-medium text-gray-700">Tên nhà cung cấp:</span>
                  <span className="ml-2">{supplier?.name}</span>
                </div>
                <div className="mb-3">
                  <span className="font-medium text-gray-700">Trạng thái:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-sm ${supplier?.status === Status.ACTIVE ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {supplier?.status === Status.ACTIVE ? 'Hoạt động' : 'Không hoạt động'}
                  </span>
                </div>
              </div>
            </div>

            <div className="info-group">
              <h3 className="text-lg font-semibold mb-2">Thông tin liên hệ</h3>
              <div className="p-4 bg-gray-50 rounded">
                <div className="mb-3">
                  <span className="font-medium text-gray-700">Địa chỉ:</span>
                  <span className="ml-2">{supplier?.address || "Chưa cập nhật"}</span>
                </div>
                <div className="mb-3">
                  <span className="font-medium text-gray-700">Số điện thoại:</span>
                  <span className="ml-2">{supplier?.phone || "Chưa cập nhật"}</span>
                </div>
                <div className="mb-3">
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="ml-2">{supplier?.email || "Chưa cập nhật"}</span>
                </div>
                <div className="mb-3">
                  <span className="font-medium text-gray-700">Người liên hệ:</span>
                  <span className="ml-2">{supplier?.contact_person || "Chưa cập nhật"}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "transactions" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Lịch sử giao dịch</h3>
              <button
                className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                onClick={() => setShowTransactionModal(true)}
              >
                + Thêm giao dịch
              </button>
            </div>

            {transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày giao dịch</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại giao dịch</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số tiền</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã chứng từ</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                      <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id}>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{formatDate(transaction.transaction_date)}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                          {transaction.transaction_type === 'receipt' && 'Nhập hàng'}
                          {transaction.transaction_type === 'payment' && 'Thanh toán'}
                          {transaction.transaction_type === 'return' && 'Trả hàng'}
                          {transaction.transaction_type === 'other' && 'Khác'}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                          {transaction.amount.toLocaleString('vi-VN')} đ
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{transaction.document_no || '---'}</td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              transaction.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : transaction.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {transaction.status === 'completed' ? 'Hoàn thành' : transaction.status === 'pending' ? 'Đang xử lý' : 'Đã hủy'}
                          </span>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{transaction.description || '---'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">Chưa có giao dịch nào với nhà cung cấp này</div>
            )}
          </div>
        )}

        {activeTab === "ratings" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Đánh giá nhà cung cấp</h3>
              <button
                className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                onClick={() => setShowRatingModal(true)}
              >
                + Thêm đánh giá
              </button>
            </div>

            <div className="mb-6 p-4 bg-gray-50 rounded">
              <h4 className="font-medium mb-2">Điểm đánh giá trung bình</h4>
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold text-yellow-500">{calculateAverageRating().toFixed(1)}/5</div>
                <div className="text-sm text-gray-500">({ratings.length} lượt đánh giá)</div>
              </div>
            </div>

            {ratings.length > 0 ? (
              <div className="space-y-4">
                {ratings.map((rating) => (
                  <div key={rating.id} className="border p-4 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <div className="font-medium">Đánh giá ngày {formatDate(rating.rating_date)}</div>
                      <div className="text-sm text-gray-500">Người đánh giá: {rating.rated_by || "Không xác định"}</div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="text-sm text-gray-500">Chất lượng</div>
                        <div className="font-medium">{rating.quality_score}/5</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="text-sm text-gray-500">Giao hàng</div>
                        <div className="font-medium">{rating.delivery_score}/5</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="text-sm text-gray-500">Giá cả</div>
                        <div className="font-medium">{rating.price_score}/5</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="text-sm text-gray-500">Dịch vụ</div>
                        <div className="font-medium">{rating.service_score}/5</div>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 p-2 rounded text-center">
                      <div className="text-sm text-gray-700">Điểm tổng hợp</div>
                      <div className="font-bold text-yellow-600">{rating.overall_score}/5</div>
                    </div>
                    
                    {rating.feedback && (
                      <div className="mt-3 p-3 bg-gray-50 rounded">
                        <div className="text-sm font-medium mb-1">Nhận xét:</div>
                        <div className="text-sm text-gray-600">{rating.feedback}</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">Chưa có đánh giá nào cho nhà cung cấp này</div>
            )}
          </div>
        )}

        {activeTab === "contracts" && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Hợp đồng & Thanh toán</h3>
              <button
                className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                onClick={() => setShowContractModal(true)}
              >
                + Thêm hợp đồng
              </button>
            </div>

            {contracts.length > 0 ? (
              <div className="space-y-6">
                {contracts.map((contract) => (
                  <div key={contract.id} className="border rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">
                          Hợp đồng: <span className="text-blue-600">{contract.contract_no}</span>
                        </h4>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            contract.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : contract.status === 'expired'
                              ? 'bg-gray-100 text-gray-800'
                              : contract.status === 'draft'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {contract.status === 'active' 
                            ? 'Đang hiệu lực' 
                            : contract.status === 'expired'
                            ? 'Hết hạn'
                            : contract.status === 'draft'
                            ? 'Bản nháp'
                            : 'Đã chấm dứt'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-500">Ngày ký hợp đồng</div>
                          <div>{formatDate(contract.contract_date)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Loại hợp đồng</div>
                          <div>
                            {contract.contract_type === 'longterm' && 'Dài hạn'}
                            {contract.contract_type === 'project' && 'Theo dự án'}
                            {contract.contract_type === 'oneshot' && 'Một lần'}
                            {!contract.contract_type && 'Không xác định'}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Thời hạn</div>
                          <div>{formatDate(contract.start_date)} - {contract.end_date ? formatDate(contract.end_date) : 'Không xác định'}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500">Tổng giá trị</div>
                          <div>{contract.total_value ? contract.total_value.toLocaleString('vi-VN') + ' đ' : 'Không xác định'}</div>
                        </div>
                      </div>
                      
                      {contract.payment_terms && (
                        <div className="mb-3">
                          <div className="text-sm font-medium">Điều khoản thanh toán:</div>
                          <div className="text-sm">{contract.payment_terms}</div>
                        </div>
                      )}
                      
                      {contract.delivery_terms && (
                        <div className="mb-3">
                          <div className="text-sm font-medium">Điều khoản giao hàng:</div>
                          <div className="text-sm">{contract.delivery_terms}</div>
                        </div>
                      )}
                      
                      {/* Payments related to this contract */}
                      <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-medium">Thanh toán</h5>
                          <button
                            className="text-blue-600 text-sm"
                            onClick={() => {
                              setSelectedContractId(contract.id.toString());
                              setShowPaymentModal(true);
                            }}
                          >
                            + Thêm thanh toán
                          </button>
                        </div>
                        
                        {payments && payments.filter(p => p.contract_id === contract.id).length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày thanh toán</th>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số tiền</th>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phương thức</th>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số tham chiếu</th>
                                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {payments
                                  .filter(payment => payment.contract_id === contract.id)
                                  .map((payment) => (
                                  <tr key={payment.id}>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{formatDate(payment.payment_date)}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{payment.amount.toLocaleString('vi-VN')} đ</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                      {payment.payment_method === 'bank_transfer' && 'Chuyển khoản'}
                                      {payment.payment_method === 'cash' && 'Tiền mặt'}
                                      {payment.payment_method === 'credit' && 'Công nợ'}
                                      {!payment.payment_method && '---'}
                                    </td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">{payment.reference_no || '---'}</td>
                                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                                      <span
                                        className={`px-2 py-1 text-xs rounded-full ${
                                          payment.status === 'completed'
                                            ? 'bg-green-100 text-green-800'
                                            : payment.status === 'pending'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-red-100 text-red-800'
                                        }`}
                                      >
                                        {payment.status === 'completed' ? 'Đã thanh toán' : payment.status === 'pending' ? 'Đang xử lý' : 'Đã hủy'}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 py-2">Chưa có thanh toán nào cho hợp đồng này</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">Chưa có hợp đồng nào với nhà cung cấp này</div>
            )}
          </div>
        )}
      </div>
      
      {/* Transaction Modal */}
      {showTransactionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <SupplierTransactionForm 
              supplierId={params.id}
              onClose={() => setShowTransactionModal(false)}
              onSuccess={handleFormSuccess}
            />
          </div>
        </div>
      )}
      
      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <SupplierRatingForm 
              supplierId={params.id}
              onClose={() => setShowRatingModal(false)}
              onSuccess={handleFormSuccess}
            />
          </div>
        </div>
      )}
      
      {/* Contract Modal */}
      {showContractModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <SupplierContractForm 
              supplierId={params.id}
              onClose={() => setShowContractModal(false)}
              onSuccess={handleFormSuccess}
            />
          </div>
        </div>
      )}
      
      {/* Payment Modal */}
      {showPaymentModal && selectedContractId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <SupplierContractPaymentForm 
              contractId={selectedContractId}
              onClose={() => {
                setShowPaymentModal(false);
                setSelectedContractId(null);
              }}
              onSuccess={handleFormSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
} 
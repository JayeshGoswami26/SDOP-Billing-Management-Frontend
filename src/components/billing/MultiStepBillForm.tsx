import React, { useState, useEffect, useRef } from "react";
import { useApi } from "../../hooks/useApi";
import Button from "../../components/ui/button/Button";
import Input from "../../components/form/input/InputField";
import Select from "../../components/form/Select";
import Label from "../../components/form/Label";
import { Loader2, Plus, Trash2, Save, Download } from "lucide-react";
import BillPrintPage from "../../pages/BillingPage/BillPrintPage";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface Customer {
  _id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  address?: string;
}

interface Product {
  productName: string;
  productType: "silver" | "gold";
  rate: number;
  price: number;
  quantity: number;
  weight: string;
  amount: number;
}

interface BillData {
  customerId: string;
  customerName: string;
  customerPhone: string;
  billType: "green" | "white";
  products: Product[];
  cgstRate: number;
  sgstRate: number;
  paymentMethod: "cash" | "card" | "upi" | "bank_transfer";
}

const initialBillData: BillData = {
  customerId: "",
  customerName: "",
  customerPhone: "",
  billType: "white",
  products: [
    {
      productName: "",
      productType: "gold",
      rate: 0,
      price: 0,
      quantity: 1,
      weight: "",
      amount: 0,
    },
  ],
  cgstRate: 3,
  sgstRate: 3,
  paymentMethod: "cash",
};

export default function MultiStepBillForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [billData, setBillData] = useState<BillData>(initialBillData);
  const [showPreview, setShowPreview] = useState(false);
  const [existingCustomer, setExistingCustomer] = useState<Customer | null>(
    null
  );
  const [isSearchingCustomer, setIsSearchingCustomer] = useState(false);
  const [billNumber, setBillNumber] = useState("");
  const billRef = useRef<HTMLDivElement>(null);

  const generateBillNumber = () => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `BILL-${year}${month}${day}-${random}`;
  };

  const downloadPDF = async () => {
    if (billRef.current) {
      try {
        const canvas = await html2canvas(billRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`bill-${billNumber}.pdf`);
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    }
  };

  const {
    data: customersResponse,
    loading: customersLoading,
    run: searchCustomers,
  } = useApi<{ success: boolean; message: string; data: Customer[] }>(
    "customers/search",
    "GET",
    { manual: true }
  );
  const {
    data: createBillResponse,
    loading: createBillLoading,
    error: createBillError,
    run: createBill,
  } = useApi("bills/", "POST", { manual: true });

  const totalSteps = 3;

  const handleCustomerSearch = async (phone: string) => {
    if (phone.length >= 10) {
      setIsSearchingCustomer(true);
      try {
        await searchCustomers(undefined, { search: phone });
      } catch (error) {
        console.error("Error searching customer:", error);
        setExistingCustomer(null);
        setBillData((prev) => ({
          ...prev,
          customerId: "",
          customerName: "",
          customerPhone: phone,
        }));
        setIsSearchingCustomer(false);
      }
    }
  };

  useEffect(() => {
    if (customersResponse?.data && customersResponse.data.length > 0) {
      const customer = customersResponse.data[0];
      setExistingCustomer(customer);
      setBillData((prev) => ({
        ...prev,
        customerId: customer._id,
        customerName: customer.name,
        customerPhone: customer.phoneNumber,
      }));
    } else if (customersResponse?.data && customersResponse.data.length === 0) {
      setExistingCustomer(null);
      setBillData((prev) => ({
        ...prev,
        customerId: "",
        customerName: "",
        customerPhone: billData.customerPhone,
      }));
    }
    setIsSearchingCustomer(false);
  }, [customersResponse]);

  const addProduct = () => {
    setBillData((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        {
          productName: "",
          productType: "gold",
          rate: 0,
          price: 0,
          quantity: 1,
          weight: "",
          amount: 0,
        },
      ],
    }));
  };

  const removeProduct = (index: number) => {
    if (billData.products.length > 1) {
      setBillData((prev) => ({
        ...prev,
        products: prev.products.filter((_, i) => i !== index),
      }));
    }
  };

  const updateProduct = (
    index: number,
    field: keyof Product,
    value: string | number
  ) => {
    setBillData((prev) => {
      const updatedProducts = [...prev.products];
      updatedProducts[index] = { ...updatedProducts[index], [field]: value };

      if (field === "price" || field === "quantity") {
        updatedProducts[index].amount =
          updatedProducts[index].price * updatedProducts[index].quantity;
      }

      return { ...prev, products: updatedProducts };
    });
  };

  const calculateTotals = () => {
    const subtotal = billData.products.reduce(
      (sum, product) => sum + product.amount,
      0
    );

    if (billData.billType === "green") {
      return { subtotal, cgstAmount: 0, sgstAmount: 0, totalAmount: subtotal };
    }

    const cgstAmount = (subtotal * billData.cgstRate) / 100;
    const sgstAmount = (subtotal * billData.sgstRate) / 100;
    const totalAmount = subtotal + cgstAmount + sgstAmount;

    return { subtotal, cgstAmount, sgstAmount, totalAmount };
  };

  const handleSubmit = async () => {
    const { subtotal, cgstAmount, sgstAmount, totalAmount } = calculateTotals();

    const billPayload = {
      customerId: billData.customerId || null,
      customerName: billData.customerName,
      customerPhone: billData.customerPhone,
      jewelryType: billData.products[0]?.productType || "gold",
      billType: billData.billType,
      products: billData.products.map((p) => ({
        productName: p.productName,
        price: p.price,
        quantity: p.quantity,
        weight: p.weight,
        subtotal: p.amount,
      })),
      cgstRate: billData.billType === "white" ? billData.cgstRate : 0,
      sgstRate: billData.billType === "white" ? billData.sgstRate : 0,
      paymentMethod: billData.paymentMethod,
    };

    try {
      const response = await createBill(billPayload);
      if (response?.data) {
        setBillNumber(response.data.billNumber);
        setShowPreview(true);
      }
    } catch (error) {
      console.error("Error creating bill:", error);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetForm = () => {
    setBillData(initialBillData);
    setCurrentStep(1);
    setShowPreview(false);
    setExistingCustomer(null);
  };

  if (showPreview) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center print:hidden">
          <h2 className="text-2xl font-bold">Bill Preview</h2>
          <div className="space-x-2">
            <Button onClick={() => window.print()} variant="outline">
              Print Bill
            </Button>
            <Button onClick={downloadPDF} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button onClick={resetForm} variant="primary">
              Create New Bill
            </Button>
          </div>
        </div>
        <div ref={billRef} className="print-area">
          <BillPrintPage
            billData={billData}
            totals={calculateTotals()}
            billNumber={billNumber}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold">Create New Bill</h2>
          <span className="text-sm text-gray-500">
            Step {currentStep} of {totalSteps}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <div className="border rounded-lg p-6 bg-white shadow-sm">
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="px-0 pt-0">
              <h3 className="text-lg font-semibold">Customer Information</h3>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter customer phone number"
                  value={billData.customerPhone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setBillData((prev) => ({
                      ...prev,
                      customerPhone: e.target.value,
                    }));
                    handleCustomerSearch(e.target.value);
                  }}
                />
                {isSearchingCustomer && (
                  <div className="flex items-center mt-2 text-sm text-blue-600">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Searching for existing customer...
                  </div>
                )}
                {existingCustomer && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-800 text-sm font-medium">
                      ✓ Found existing customer: {existingCustomer.name}
                    </p>
                    <p className="text-green-700 text-xs mt-1">
                      Customer details will be auto-filled
                    </p>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="name">Customer Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter customer name"
                  value={billData.customerName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setBillData((prev) => ({
                      ...prev,
                      customerName: e.target.value,
                    }))
                  }
                  disabled={!!existingCustomer}
                  className={existingCustomer ? "bg-gray-50" : ""}
                />
                {existingCustomer && (
                  <p className="text-xs text-gray-500 mt-1">
                    Customer name is auto-filled from existing record
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="billType">Bill Type *</Label>
                <Select
                  options={[
                    { value: "white", label: "White Bill (With GST)" },
                    { value: "green", label: "Green Bill (Without GST)" },
                  ]}
                  defaultValue={billData.billType}
                  onChange={(value: string) =>
                    setBillData((prev) => ({
                      ...prev,
                      billType: value as "green" | "white",
                    }))
                  }
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="px-0 pt-0">
              <h3 className="text-lg font-semibold">Product Details</h3>
            </div>

            <div className="space-y-4">
              {billData.products.map((product, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Product {index + 1}</h4>
                    {billData.products.length > 1 && (
                      <Button
                        onClick={() => removeProduct(index)}
                        variant="outline"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                      <Label htmlFor={`productName-${index}`}>
                        Product Name *
                      </Label>
                      <Input
                        id={`productName-${index}`}
                        placeholder="Enter product name"
                        value={product.productName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          updateProduct(index, "productName", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor={`productType-${index}`}>
                        Product Type *
                      </Label>
                      <Select
                        options={[
                          { value: "gold", label: "Gold" },
                          { value: "silver", label: "Silver" },
                        ]}
                        defaultValue={product.productType}
                        onChange={(value: string) =>
                          updateProduct(index, "productType", value)
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor={`weight-${index}`}>Weight *</Label>
                      <Input
                        id={`weight-${index}`}
                        placeholder="e.g., 1.11grm"
                        value={product.weight}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          updateProduct(index, "weight", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor={`rate-${index}`}>Rate *</Label>
                      <Input
                        id={`rate-${index}`}
                        type="number"
                        placeholder="0"
                        value={product.rate || ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          updateProduct(
                            index,
                            "rate",
                            parseFloat(e.target.value) || 0
                          )
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor={`price-${index}`}>Price *</Label>
                      <Input
                        id={`price-${index}`}
                        type="number"
                        placeholder="0"
                        value={product.price || ""}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          updateProduct(
                            index,
                            "price",
                            parseFloat(e.target.value) || 0
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-medium">
                      Amount: ₹{product.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}

              <Button onClick={addProduct} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="space-y-4">
                <h4 className="font-medium">Tax Information</h4>

                {billData.billType === "white" ? (
                  <>
                    <div>
                      <Label htmlFor="cgstRate">CGST Rate (%)</Label>
                      <Input
                        id="cgstRate"
                        type="number"
                        placeholder="3"
                        value={billData.cgstRate}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setBillData((prev) => ({
                            ...prev,
                            cgstRate: parseFloat(e.target.value) || 0,
                          }))
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="sgstRate">SGST Rate (%)</Label>
                      <Input
                        id="sgstRate"
                        type="number"
                        placeholder="3"
                        value={billData.sgstRate}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setBillData((prev) => ({
                            ...prev,
                            sgstRate: parseFloat(e.target.value) || 0,
                          }))
                        }
                      />
                    </div>
                  </>
                ) : (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-800 text-sm">
                      Green Bill - No GST applicable
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Payment Information</h4>

                <div>
                  <Label htmlFor="paymentMethod">Payment Method *</Label>
                  <Select
                    options={[
                      { value: "cash", label: "Cash" },
                      { value: "card", label: "Card" },
                      { value: "upi", label: "UPI" },
                      { value: "bank_transfer", label: "Bank Transfer" },
                    ]}
                    defaultValue={billData.paymentMethod}
                    onChange={(value: string) =>
                      setBillData((prev) => ({
                        ...prev,
                        paymentMethod: value as
                          | "cash"
                          | "card"
                          | "upi"
                          | "bank_transfer",
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="px-0 pt-0">
              <h3 className="text-lg font-semibold">Review & Submit</h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Customer Details</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Name:</strong> {billData.customerName}
                    </p>
                    <p>
                      <strong>Phone:</strong> {billData.customerPhone}
                    </p>
                    <p>
                      <strong>Bill Type:</strong>{" "}
                      {billData.billType === "white"
                        ? "White Bill (With GST)"
                        : "Green Bill (Without GST)"}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Payment Details</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Method:</strong> {billData.paymentMethod}
                    </p>
                    {billData.billType === "white" && (
                      <>
                        <p>
                          <strong>CGST:</strong> {billData.cgstRate}%
                        </p>
                        <p>
                          <strong>SGST:</strong> {billData.sgstRate}%
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* <div>
                  <h4 className="font-medium mb-2">Products</h4>
                  <div className="space-y-2">
                    {billData.products.map((product, index) => (
                      <div key={index} className="flex justify-between text-sm border-b pb-1">
                        <span>{product.productName} ({product.productType}) (Qty: {product.quantity})</span>
                        <span>₹{product.amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div> */}

              <div className="border-t pt-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{calculateTotals().subtotal.toFixed(2)}</span>
                  </div>
                  {billData.billType === "white" && (
                    <>
                      <div className="flex justify-between">
                        <span>CGST ({billData.cgstRate}%):</span>
                        <span>₹{calculateTotals().cgstAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>SGST ({billData.sgstRate}%):</span>
                        <span>₹{calculateTotals().sgstAmount.toFixed(2)}</span>
                      </div>
                    </>
                  )}
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span>₹{calculateTotals().totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {createBillError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600 text-sm">
              Error creating bill: {createBillError}
            </p>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <Button
            onClick={prevStep}
            disabled={currentStep === 1}
            variant="outline"
          >
            Previous
          </Button>

          <div className="space-x-2">
            {currentStep < totalSteps ? (
              <Button
                onClick={nextStep}
                disabled={
                  (currentStep === 1 &&
                    (!billData.customerName || !billData.customerPhone)) ||
                  (currentStep === 2 &&
                    billData.products.some((p) => !p.productName || !p.price))
                }
              >
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={createBillLoading}>
                {createBillLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Bill...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Bill
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

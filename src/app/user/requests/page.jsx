"use client";
import { navigate } from "next/dist/client/components/segment-cache/navigation";
import React, { useState } from "react";

const RequestPage = () => {
  const [activeTab, setActiveTab] = useState("selection");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    nid: "",
    experience: "",
    specialization: "",
    tradeLicense: "",
    address: "",
    documents: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, documents: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    let isSuccess = false;

    try {
      let imageUrl = "";

      if (formData.documents) {
        console.log("Starting image upload to ImgBB...");
        const formDataImg = new FormData();
        formDataImg.append("image", formData.documents);

        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=51e1c3568d8444bbe2b2dfaf15d7934d`,
          {
            method: "POST",
            body: formDataImg,
          },
        );

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error(
            "ImgBB upload failed with status:",
            res.status,
            errorData,
          );
          throw new Error(
            errorData.error?.message || "Failed to upload image to ImgBB",
          );
        }

        const data = await res.json();
        if (!data.data || !data.data.url) {
          throw new Error("Invalid response from image upload service");
        }
        imageUrl = data.data.url;
        console.log("Image uploaded successfully:", imageUrl);
      }

      // Now send all data (including image URL) to your backend
      const finalData = {
        ...formData,
        documents: imageUrl,
      };

      console.log("Sending data to backend /api/user/role...", finalData);
      const response = await fetch("/api/user/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: activeTab, // 'contractor' or 'worker'
          formData: finalData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Backend request failed:", response.status, errorData);
        throw new Error(errorData.error || "Failed to update role");
      }

      console.log("Application submitted successfully!");
      setShowSuccess(true);
      isSuccess = true;
    } catch (error) {
      console.error("Submission failed details:", error);
      alert(error.message || "Failed to submit application. Please try again.");
    }

    setIsSubmitting(false);

    setTimeout(() => {
      if (isSuccess) {
        router.push("/user");
      }
      setShowSuccess(false);
      setActiveTab("selection");
      setFormData({
        fullName: "",
        phone: "",
        nid: "",
        experience: "",
        specialization: "",
        tradeLicense: "",
        address: "",
        documents: null,
      });
    }, 2000);
  };

  const requirements = {
    contractor: [
      "Valid trade license certificate",
      "Minimum 3 years of construction experience",
      "Bank account details for payments",
      "Previous project portfolio (optional but recommended)",
    ],
    worker: [
      "Valid National ID (NID)",
      "Skills certification (if available)",
      "Previous work references (optional)",
      "Bank account or mobile wallet for payments",
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#006a28]/10 rounded-2xl mb-6">
            <svg
              className="w-8 h-8 text-[#006a28]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              ></path>
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Upgrade Your Role
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Unlock new opportunities and take your career to the next level.
            Choose the role that best fits your expertise.
          </p>
        </div>

        {/* Success Toast */}
        {showSuccess && (
          <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
            <div className="bg-green-50 border-l-4 border-[#006a28] rounded-lg shadow-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-[#006a28]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-green-800">
                    Application Submitted!
                  </p>
                  <p className="text-sm text-green-600">
                    Our team will review your application within 2-3 business
                    days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "selection" && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contractor Card */}
            <div
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-[#006a28]/30"
              onClick={() => setActiveTab("contractor")}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#006a28]/5 to-transparent rounded-bl-full"></div>
              <div className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[#006a28] to-[#008a35] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    ></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Become a Contractor
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Take your construction business to the next level. Manage
                  projects, hire skilled workers, and bid on large-scale
                  developments.
                </p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <svg
                      className="w-5 h-5 text-[#006a28]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>Access to premium projects</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <svg
                      className="w-5 h-5 text-[#006a28]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>Dedicated account manager</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <svg
                      className="w-5 h-5 text-[#006a28]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>Advanced analytics dashboard</span>
                  </div>
                </div>
                <button className="w-full py-3 rounded-xl font-medium text-[#006a28] border-2 border-[#006a28] hover:bg-[#006a28] hover:text-white transition-all duration-300 group-hover:shadow-md">
                  Apply as Contractor →
                </button>
              </div>
            </div>

            {/* Worker Card */}
            <div
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-[#006a28]/30"
              onClick={() => setActiveTab("worker")}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#006a28]/5 to-transparent rounded-bl-full"></div>
              <div className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[#006a28] to-[#008a35] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-md">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    ></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Become a Worker
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Find consistent work opportunities, showcase your skills, and
                  get hired by top contractors in your area.
                </p>
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <svg
                      className="w-5 h-5 text-[#006a28]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>Instant job notifications</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <svg
                      className="w-5 h-5 text-[#006a28]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>Build your professional profile</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <svg
                      className="w-5 h-5 text-[#006a28]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    <span>Safe & timely payments</span>
                  </div>
                </div>
                <button className="w-full py-3 rounded-xl font-medium text-[#006a28] border-2 border-[#006a28] hover:bg-[#006a28] hover:text-white transition-all duration-300 group-hover:shadow-md">
                  Apply as Worker →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Application Form */}
        {activeTab !== "selection" && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-500">
            <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setActiveTab("selection")}
                    className="w-10 h-10 rounded-full bg-white border border-gray-300 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm"
                    aria-label="Go back"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                      ></path>
                    </svg>
                  </button>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {activeTab === "contractor"
                        ? "Contractor Application"
                        : "Worker Application"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Tell us about yourself to help us verify your credentials
                    </p>
                  </div>
                </div>
                <div className="hidden md:block">
                  <span className="text-xs font-medium px-3 py-1 bg-[#006a28]/10 text-[#006a28] rounded-full">
                    {activeTab === "contractor"
                      ? "Business Account"
                      : "Individual Account"}
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#006a28]/30 focus:border-[#006a28] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    type="tel"
                    placeholder="+880 1XXXXXXXXX"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#006a28]/30 focus:border-[#006a28] transition-all"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    National ID (NID) <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    name="nid"
                    value={formData.nid}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="Enter NID number"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#006a28]/30 focus:border-[#006a28] transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    Years of Experience <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    type="number"
                    min="0"
                    placeholder="Number of years"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#006a28]/30 focus:border-[#006a28] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  {activeTab === "contractor"
                    ? "Company Name"
                    : "Specialization"}
                  {activeTab === "worker" && (
                    <span className="text-red-500">*</span>
                  )}
                </label>
                <input
                  required={activeTab === "worker"}
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  type="text"
                  placeholder={
                    activeTab === "contractor"
                      ? "Your company name (optional)"
                      : "e.g., Masonry, Carpentry, Electrical, Plumbing"
                  }
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#006a28]/30 focus:border-[#006a28] transition-all"
                />
              </div>

              {activeTab === "contractor" && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    Trade License Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    required
                    name="tradeLicense"
                    value={formData.tradeLicense}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="Enter trade license number"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#006a28]/30 focus:border-[#006a28] transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    You'll need to upload your license document later
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Enter your full address with district and division"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#006a28]/30 focus:border-[#006a28] transition-all resize-none"
                ></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  Supporting Documents
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-[#006a28] transition-colors cursor-pointer">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer block">
                    <div className="text-center">
                      <svg
                        className="w-12 h-12 text-gray-400 mx-auto mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        ></path>
                      </svg>
                      <p className="text-sm text-gray-600">
                        {formData.documents
                          ? formData.documents.name
                          : "Click to upload or drag and drop"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PDF, JPG, or PNG (max. 5MB)
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Requirements Box */}
              <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  Requirements for{" "}
                  {activeTab === "contractor" ? "Contractors" : "Workers"}:
                </h4>
                <ul className="space-y-1">
                  {requirements[activeTab].map((req, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-gray-600 flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4 text-blue-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                      </svg>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Form Actions */}
              <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab("selection")}
                  className="px-6 py-3 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-[#006a28] to-[#008a35] hover:from-[#00521f] hover:to-[#006a28] transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="w-5 h-5 animate-spin"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestPage;

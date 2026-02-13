import React from 'react';

interface ClaimFormProps {
  onSubmit: (data: ClaimFormData) => void;
  isLoading?: boolean;
}

export interface ClaimFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export function ClaimForm({ onSubmit, isLoading = false }: ClaimFormProps) {
  const [formData, setFormData] = React.useState<ClaimFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const handleChange = (field: keyof ClaimFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-[214px]">
      {/* Title */}
      <h3 className="font-roboto font-black text-xs text-blue-dark uppercase text-center mb-4">
        Enter Your details to claim your prize
      </h3>

      {/* First Name */}
      <div>
        <input
          type="text"
          value={formData.firstName}
          onChange={handleChange('firstName')}
          placeholder="FIRST NAME"
          className="w-full h-[30px] px-3 rounded-[5px] border-2 border-blue-dark bg-white font-roboto font-black text-xs placeholder:text-gray-placeholder focus:outline-none focus:ring-2 focus:ring-blue-dark"
          required
        />
      </div>

      {/* Last Name */}
      <div>
        <input
          type="text"
          value={formData.lastName}
          onChange={handleChange('lastName')}
          placeholder="LAST NAME"
          className="w-full h-[30px] px-3 rounded-[5px] border-2 border-blue-dark bg-white font-roboto font-black text-xs placeholder:text-gray-placeholder focus:outline-none focus:ring-2 focus:ring-blue-dark"
          required
        />
      </div>

      {/* Email */}
      <div>
        <input
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          placeholder="EMAIL"
          className="w-full h-[30px] px-3 rounded-[5px] border-2 border-blue-dark bg-white font-roboto font-black text-xs placeholder:text-gray-placeholder focus:outline-none focus:ring-2 focus:ring-blue-dark"
          required
        />
      </div>

      {/* Phone */}
      <div>
        <input
          type="tel"
          value={formData.phone}
          onChange={handleChange('phone')}
          placeholder="PHONE"
          className="w-full h-[30px] px-3 rounded-[5px] border-2 border-blue-dark bg-white font-roboto font-black text-xs placeholder:text-gray-placeholder focus:outline-none focus:ring-2 focus:ring-blue-dark"
          required
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full h-[58px] bg-green-button hover:bg-green-button/90 disabled:bg-gray-400 disabled:cursor-not-allowed text-gray-light font-bungee text-2xl rounded-[20px] border-4 border-green-stroke shadow-[0_0_5px_1px_rgba(0,0,0,0.25)] transition-all hover:scale-105 active:scale-95"
      >
        {isLoading ? 'Claiming...' : 'Claim Now'}
      </button>
    </form>
  );
}

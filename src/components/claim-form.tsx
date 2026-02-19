import React from 'react';

export interface ClaimFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

/** Payload for claim API - fullName is firstName + lastName */
export interface ClaimSubmitData {
  fullName: string;
  email: string;
  phone: string;
}

interface ClaimFormProps {
  onSubmit: (data: ClaimSubmitData) => void;
}

export function ClaimForm({ onSubmit }: ClaimFormProps) {
  const [formData, setFormData] = React.useState<ClaimFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleChange = (field: keyof ClaimFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    onSubmit({
      fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
      email: formData.email,
      phone: formData.phone,
    });
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-[280px] mx-auto mb-[28px]">
      {/* Title - larger gap before first field per Figma */}
      <h3 className="font-roboto font-black text-xs text-blue-dark uppercase text-center mb-6">
        Enter Your details to claim your prize
      </h3>

      {/* First Name */}
      <div>
        <input
          type="text"
          value={formData.firstName}
          onChange={handleChange('firstName')}
          placeholder="FIRST NAME"
          className="w-full h-[30px] px-3 rounded-[5px] border-2 border-blue-dark bg-white font-roboto font-black text-xs text-center placeholder:text-gray-placeholder placeholder:text-center focus:outline-none focus:ring-2 focus:ring-blue-dark"
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
          className="w-full h-[30px] px-3 rounded-[5px] border-2 border-blue-dark bg-white font-roboto font-black text-xs text-center placeholder:text-gray-placeholder placeholder:text-center focus:outline-none focus:ring-2 focus:ring-blue-dark"
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
          className="w-full h-[30px] px-3 rounded-[5px] border-2 border-blue-dark bg-white font-roboto font-black text-xs text-center placeholder:text-gray-placeholder placeholder:text-center focus:outline-none focus:ring-2 focus:ring-blue-dark"
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
          className="w-full h-[30px] px-3 rounded-[5px] border-2 border-blue-dark bg-white font-roboto font-black text-xs text-center placeholder:text-gray-placeholder placeholder:text-center focus:outline-none focus:ring-2 focus:ring-blue-dark"
          required
        />
      </div>

    </form>
  );
}

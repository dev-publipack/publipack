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
  /** Ref to form element for external submit trigger (e.g. chain block click) */
  formRef?: React.RefObject<HTMLFormElement | null>;
  /** Callback when submitting state changes (for disabling chain block) */
  onSubmittingChange?: (isSubmitting: boolean) => void;
}

export function ClaimForm({ onSubmit, formRef, onSubmittingChange }: ClaimFormProps) {
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
    onSubmittingChange?.(true);
    onSubmit({
      fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
      email: formData.email,
      phone: formData.phone,
    });
    setIsSubmitting(false);
    onSubmittingChange?.(false);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 w-full max-w-[224px] mx-auto ">
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

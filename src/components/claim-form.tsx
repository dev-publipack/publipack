import React from 'react';
import { z } from 'zod';

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

const ClaimFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phone: z.string().optional(),
});

type FormErrors = Partial<Record<keyof ClaimFormData, string>>;

interface ClaimFormProps {
  onSubmit: (data: ClaimSubmitData) => void | Promise<void>;
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
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleChange = (field: keyof ClaimFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = ClaimFormSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof ClaimFormData;
        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    onSubmittingChange?.(true);
    try {
      await onSubmit({
        fullName: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
        email: formData.email,
        phone: formData.phone,
      });
    } finally {
      setIsSubmitting(false);
      onSubmittingChange?.(false);
    }
  };

  const inputClass = (field: keyof ClaimFormData) =>
    `w-full h-[30px] px-3 rounded-[5px] border-2 bg-white font-roboto font-black text-xs text-center placeholder:text-gray-placeholder placeholder:text-center focus:outline-none focus:ring-2 ${
      errors[field]
        ? 'border-red-500 focus:ring-red-500'
        : 'border-blue-dark focus:ring-blue-dark'
    }`;

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-4 w-full max-w-[224px] mx-auto">
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
          autoComplete="given-name"
          className={inputClass('firstName')}
        />
        {errors.firstName && (
          <p className="mt-1 text-[10px] text-red-500 text-center">{errors.firstName}</p>
        )}
      </div>

      {/* Last Name */}
      <div>
        <input
          type="text"
          value={formData.lastName}
          onChange={handleChange('lastName')}
          placeholder="LAST NAME"
          autoComplete="family-name"
          className={inputClass('lastName')}
        />
        {errors.lastName && (
          <p className="mt-1 text-[10px] text-red-500 text-center">{errors.lastName}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <input
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          placeholder="EMAIL"
          autoComplete="email"
          className={inputClass('email')}
        />
        {errors.email && (
          <p className="mt-1 text-[10px] text-red-500 text-center">{errors.email}</p>
        )}
      </div>

      {/* Phone - optional */}
      <div>
        <input
          type="tel"
          value={formData.phone}
          onChange={handleChange('phone')}
          placeholder="PHONE"
          autoComplete="tel"
          className={inputClass('phone')}
        />
      </div>

    </form>
  );
}

import React from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext'

interface FormField {
  name: string;
  label: string;
  type: string;
  required?: boolean;
}

interface SettingsFormProps {
  title: string;
  fields: FormField[];
  onSubmit: (data: any) => void;
  onClose: () => void;
  initialData?: any;
}

function SettingsForm({ title, fields, onSubmit, onClose, initialData }: SettingsFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    onSubmit(data);
  };

  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 bg-[#1A1025] bg-opacity-50 flex items-center justify-center">
      <div className={`rounded-lg shadow-xl p-6 w-full max-w-md ${theme === 'dark' ? 'bg-[#1A1025] text-purple-200' : 'bg-white'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-purple-200' : 'text-gray-700'} `}>
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                required={field.required}
                defaultValue={initialData?.[field.name] || ''}
                className={`mt-1 block w-full rounded-md border-purple-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 h-9 ${theme === 'dark' ? 'bg-[#2D1F3F] text-purple-200' : 'bg-gray-100 text-gray-700'}`}
              />
            </div>
          ))}

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-2 border border-gray-300 rounded-md text-sm font-medium ${theme === 'dark' ? 'text-purple-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'} `}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
            >
              {initialData ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SettingsForm;
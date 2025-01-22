import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowLeft } from 'lucide-react';
import SettingsTable from '../../components/settings/SettingsTable';
import SettingsForm from '../../components/settings/SettingsForm';
import { useSettingsData } from '../../hooks/settings/useSettingsData';
import {useTheme} from '../../contexts/ThemeContext';

function Brands() {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const { data, loading, addItem, updateItem, deleteItem } = useSettingsData('brands');
  const { theme } = useTheme();

  const fields = [
    { name: 'name', label: 'Brand Name', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'text' }
  ];

  const handleSubmit = async (formData: any) => {
    if (editingItem) {
      await updateItem(editingItem.id, formData);
    } else {
      await addItem(formData);
    }
    setShowForm(false);
    setEditingItem(null);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <Link 
            to='/settings'
            className='flex-shrink-0'
            >
          <ArrowLeft className={`${theme === 'dark' ? 'text-violet-200' : 'text-gray-900'}`} />
        </Link>
        <h1 className={`${theme === 'dark' ? 'text-violet-200' : 'text-gray-900'} text-2xl font-semibold`}>Add Brand</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-purple-600 text-white px-2 py-2 rounded-md hover:bg-purple-700"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <SettingsTable
        headers={['Name', 'Description']}
        data={data}
        onEdit={(item) => {
          setEditingItem(item);
          setShowForm(true);
        }}
        onDelete={(item) => deleteItem(item.id)}
      />

      {showForm && (
        <SettingsForm
          title={editingItem ? 'Edit Brand' : 'Add Brand'}
          fields={fields}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingItem(null);
          }}
          initialData={editingItem}
        />
      )}
    </div>
  );
}

export default Brands;
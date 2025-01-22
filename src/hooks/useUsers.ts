import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  role: string;
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      const { data, error } = await supabase
        .rpc('get_user_profiles');

      if (data) {
        setUsers(data);
      }
      setIsLoading(false);
    }

    fetchUsers();
  }, []);

  const updateUserRole = async (userId: string, role: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId);

    if (!error) {
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role } : user
      ));
    }
  };

  return { users, isLoading, updateUserRole };
}
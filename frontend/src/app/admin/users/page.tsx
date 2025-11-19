'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Users, Search, UserPlus, Ban, CheckCircle, XCircle } from 'lucide-react';

export default function AdminUsersPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (user?.role !== 'SUPER_ADMIN') {
      router.push('/dashboard');
      return;
    }

    fetchUsers();
  }, [isAuthenticated, user, router]);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIF' ? 'INACTIF' : 'ACTIF';
    if (!confirm(`${newStatus === 'INACTIF' ? 'Désactiver' : 'Activer'} cet utilisateur ?`)) {
      return;
    }

    try {
      await api.patch(`/admin/users/${userId}/status`, { status: newStatus });
      alert(`✅ Utilisateur ${newStatus === 'INACTIF' ? 'désactivé' : 'activé'}`);
      fetchUsers();
    } catch (error) {
      alert('Erreur lors de la modification du statut');
    }
  };

  const handleResetPassword = async (userId: string, email: string) => {
    if (!confirm(`Réinitialiser le mot de passe de ${email} ?`)) {
      return;
    }

    try {
      const response = await api.post(`/admin/users/${userId}/reset-password`);
      alert(`✅ Nouveau mot de passe : ${response.data.newPassword}`);
    } catch (error) {
      alert('Erreur lors de la réinitialisation');
    }
  };

  const filteredUsers = users.filter((u: any) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (!isAuthenticated || user?.role !== 'SUPER_ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50">
        <div className="container-custom py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des utilisateurs</h1>
              <p className="text-gray-600">Gérez les comptes utilisateurs de la plateforme</p>
            </div>
            <button className="btn-primary flex items-center space-x-2">
              <UserPlus className="w-5 h-5" />
              <span>Nouvel utilisateur</span>
            </button>
          </div>

          {/* Filtres */}
          <div className="card p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="input"
              >
                <option value="all">Tous les rôles</option>
                <option value="VENDEUR">Vendeurs</option>
                <option value="SUPER_ADMIN">Super Admins</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Utilisateur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Téléphone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rôle
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Inscription
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                          Aucun utilisateur trouvé
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((userItem: any) => (
                        <tr key={userItem.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                                <span className="text-primary-600 font-bold">
                                  {userItem.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {userItem.name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {userItem.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {userItem.phone || '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`badge ${
                              userItem.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-800' : 'badge-info'
                            }`}>
                              {userItem.role === 'SUPER_ADMIN' ? 'Admin' : 'Vendeur'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {formatDate(userItem.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`badge ${
                              userItem.status === 'ACTIF' ? 'badge-success' : 'badge-error'
                            }`}>
                              {userItem.status || 'ACTIF'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => handleToggleStatus(userItem.id, userItem.status || 'ACTIF')}
                              className={`btn-sm ${
                                userItem.status === 'ACTIF' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                              } text-white`}
                              title={userItem.status === 'ACTIF' ? 'Désactiver' : 'Activer'}
                            >
                              {userItem.status === 'ACTIF' ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleResetPassword(userItem.id, userItem.email)}
                              className="btn-outline btn-sm"
                              title="Réinitialiser le mot de passe"
                            >
                              Réinitialiser MDP
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}






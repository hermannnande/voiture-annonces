'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Eye, Search, Filter } from 'lucide-react';

export default function AuditLogsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (user?.role !== 'SUPER_ADMIN') {
      router.push('/dashboard');
      return;
    }

    fetchLogs();
  }, [isAuthenticated, user, router, page, actionFilter]);

  const fetchLogs = async () => {
    try {
      const params: any = { page, limit: 50 };
      if (actionFilter !== 'all') {
        params.action = actionFilter;
      }

      const response = await api.get('/admin/audit-logs', { params });
      setLogs(response.data.logs || response.data);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Erreur lors du chargement des logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log: any) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      log.action.toLowerCase().includes(search) ||
      log.details?.toLowerCase().includes(search) ||
      log.user?.email.toLowerCase().includes(search)
    );
  });

  const getActionBadge = (action: string) => {
    const badges: any = {
      'LISTING_CREATED': 'badge-info',
      'LISTING_UPDATED': 'badge-warning',
      'LISTING_APPROVED': 'badge-success',
      'LISTING_REJECTED': 'badge-error',
      'LISTING_DELETED': 'badge-error',
      'USER_LOGIN': 'badge bg-blue-100 text-blue-800',
      'USER_REGISTERED': 'badge-success',
      'BOOST_PURCHASED': 'badge bg-purple-100 text-purple-800',
    };
    return badges[action] || 'badge';
  };

  const getActionLabel = (action: string) => {
    const labels: any = {
      'LISTING_CREATED': 'Annonce créée',
      'LISTING_UPDATED': 'Annonce modifiée',
      'LISTING_APPROVED': 'Annonce approuvée',
      'LISTING_REJECTED': 'Annonce refusée',
      'LISTING_DELETED': 'Annonce supprimée',
      'USER_LOGIN': 'Connexion',
      'USER_REGISTERED': 'Inscription',
      'BOOST_PURCHASED': 'Boost acheté',
    };
    return labels[action] || action;
  };

  if (!isAuthenticated || user?.role !== 'SUPER_ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gray-50">
        <div className="container-custom py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Logs d'Audit
            </h1>
            <p className="text-gray-600">
              Traçabilité complète de toutes les actions sur la plateforme
            </p>
          </div>

          {/* Filtres */}
          <div className="card p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher dans les logs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="input"
              >
                <option value="all">Toutes les actions</option>
                <option value="LISTING_CREATED">Annonces créées</option>
                <option value="LISTING_APPROVED">Annonces approuvées</option>
                <option value="LISTING_REJECTED">Annonces refusées</option>
                <option value="USER_LOGIN">Connexions</option>
                <option value="USER_REGISTERED">Inscriptions</option>
                <option value="BOOST_PURCHASED">Achats de boosts</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <>
              <div className="card overflow-hidden mb-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date/Heure
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Utilisateur
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Action
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Détails
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          IP
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredLogs.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                            Aucun log trouvé
                          </td>
                        </tr>
                      ) : (
                        filteredLogs.map((log: any) => (
                          <tr key={log.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {formatDate(log.createdAt)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {log.user?.name || 'Système'}
                              </div>
                              <div className="text-xs text-gray-500">
                                {log.user?.email}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={getActionBadge(log.action)}>
                                {getActionLabel(log.action)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600 max-w-md truncate">
                              {log.details || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {log.ipAddress || '-'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center space-x-2">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="btn-outline btn-sm"
                  >
                    Précédent
                  </button>
                  <span className="px-4 py-2 text-sm text-gray-700">
                    Page {page} sur {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="btn-outline btn-sm"
                  >
                    Suivant
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}






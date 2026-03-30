import { useState, useEffect } from 'react'
import '../index.css'
import axios from 'axios'
import { FaTrashAlt, FaSignOutAlt } from 'react-icons/fa'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import Table from '../components/Table'


function Daashboard() {
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [formData, setFormData] = useState({ 
        id: '', name: '', desc: '', price: '', duration: '', isActive: true 
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get('https://dev.patriotmed.id/BannerAds/Package/List', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTableData(response.data?.data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error.response ? error.response.data.message : error.message);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [refreshTrigger]);

    const openModal = (item = null) => {
        if (item) {
            setIsEdit(true);
            setFormData({
                id: item.id_banner_ads_package,
                name: item.package_name,
                desc: item.package_description,
                price: item.package_price,
                duration: item.package_duration,
                isActive: item.package_is_active
            });
        } else {
            setIsEdit(false);
            setFormData({ id: '', name: '', desc: '', price: '', duration: '', isActive: true });
        }
        setShowModal(true);
    };

    const openDeleteModal = (id) => {
        setSelectedId(id);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`https://dev.patriotmed.id/BannerAds/Package/Delete/${selectedId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Data berhasil dihapus');
            setShowDeleteModal(false);
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            alert(`Gagal menghapus data: ${error.response ? error.response.data.message : error.message}`);
        }
    };

    const handleExportPDF = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('https://dev.patriotmed.id/BannerAds/Package/List', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = response.data?.data || [];
            const doc = new jsPDF();
            doc.text("Package List Report", 14, 15);
            autoTable(doc, {
                head: [['Name', 'Description', 'Price', 'Duration']],
                body: data.map(item => [item.package_name, item.package_description, `Rp ${item.package_price}`, `${item.package_duration} Hari`]),
                startY: 20
            });
            const blob = doc.output('blob');
            window.open(URL.createObjectURL(blob));
        } catch (error) {
            alert(`Gagal export PDF: ${error.response ? error.response.data.message : error.message}`);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const url = isEdit 
            ? `https://dev.patriotmed.id/BannerAds/Package/Update/${formData.id}` 
            : `https://dev.patriotmed.id/BannerAds/Package/Insert`;
        
        const payload = {
            id_banner_ads_package: Number(formData.id),
            package_name: formData.name,
            package_description: formData.desc,
            package_price: Number(formData.price),
            package_duration: Number(formData.duration),
            package_is_active: formData.isActive,
        };
        {/*ditambahkan karena ternyata nama yg sudah ada tidak bisa ditambahkan */}
        try {
            let response;
            if (isEdit) {
                response = await axios.put(url, payload, { headers: { Authorization: `Bearer ${token}` } });
            } else {
                response =await axios.post(url, payload, { headers: { Authorization: `Bearer ${token}` } });
            }
            if (response.data.result) {
                alert(`Data berhasil ${isEdit ? 'diperbarui' : 'ditambahkan'}`);
                setShowModal(false);
                setRefreshTrigger(prev => prev + 1);
            } else {
                alert(`Operasi gagal: ${response.data.message}`);
            }
        } catch (error) {
            alert(`Operasi gagal: ${error.response ? error.response.data.message : error.message}`);
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        document.cookie.split(";").forEach((c) => {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date(0).toUTCString() + ";path=/");
        });
        window.location.href = '/';
    };

    return (
        <main className="flex flex-col items-start p-4 md:p-8 bg-[#FEFBF8] min-h-screen">
            <div className="flex flex-col md:flex-row justify-between w-full mb-6 items-start md:items-center gap-4">
                <h1 className="text-xl md:text-2xl lg:text-3xl text-[#474344] font-bold">Package Lists</h1>
                <div className="flex gap-3 w-full md:w-auto">
                    <button onClick={handleExportPDF} className="flex-1 md:flex-none bg-[#9CDCF7] text-[#474344] px-4 py-2 text-base md:text-lg lg:text-xl rounded-lg font-bold shadow-md hover:brightness-90 transition-all">
                        Export PDF
                    </button>
                    <button onClick={() => openModal()} className="flex-1 md:flex-none bg-[#4D8066] text-[#FEFBF8] px-4 py-2 text-base md:text-lg lg:text-xl rounded-lg font-bold shadow-md hover:brightness-90 transition-all">
                        + Add New
                    </button>
                </div>
            </div>

            

            <Table tableData={tableData} loading={loading} onEdit={openModal} onDelete={openDeleteModal} />

            <div className="mt-10 w-full flex justify-end">
                <button onClick={handleLogout} className="flex items-center gap-2 bg-gray-800 text-white px-6 py-3 text-base md:text-lg lg:text-xl rounded-lg font-bold hover:bg-black transition-all shadow-lg">
                    <FaSignOutAlt /> Logout
                </button>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex justify-center items-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)}></div>
                    <div className="relative bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
                        <h2 className="text-xl md:text-2xl font-bold mb-4 text-[#474344]">{isEdit ? 'Edit Package' : 'Add New Package'}</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <input type="text" placeholder="Name" className="border p-3 text-base md:text-lg rounded outline-none focus:ring-1 focus:ring-emerald-500" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                            <textarea placeholder="Description" className="border p-3 text-base md:text-lg rounded outline-none focus:ring-1 focus:ring-emerald-500" value={formData.desc} onChange={(e) => setFormData({...formData, desc: e.target.value})} required />
                            <input type="number" placeholder="Price" className="border p-3 text-base md:text-lg rounded outline-none focus:ring-1 focus:ring-emerald-500" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                            <input type="number" placeholder="Duration" className="border p-3 text-base md:text-lg rounded outline-none focus:ring-1 focus:ring-emerald-500" value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})} required />
                            <div className="flex gap-2 justify-end mt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-base md:text-lg text-gray-400 font-bold">
                                    Cancel
                                </button>
                                <button type="submit" className="bg-[#4D8066] text-white px-8 py-2 text-base md:text-lg rounded-lg font-bold">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowDeleteModal(false)}></div>
                    <div className="relative bg-white p-8 rounded-xl shadow-2xl max-w-sm w-full text-center">
                        <div className="text-red-500 mb-4 flex justify-center">
                            <FaTrashAlt size={48} color="#C75454" />
                        </div>
                        <h2 className="text-xl md:text-2xl font-bold mb-2 text-gray-800">Confirm Delete</h2>
                        <p className="text-base md:text-lg text-gray-600 mb-6">Are you sure you want to delete this item? This action cannot be undone.</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => setShowDeleteModal(false)} className="px-6 py-2 text-base md:text-lg bg-gray-200 text-gray-700 rounded-lg font-bold hover:brightness-95">
                                Cancel
                            </button>
                            <button onClick={handleConfirmDelete} className="px-6 py-2 text-base md:text-lg bg-[#C75454] text-white rounded-lg font-bold hover:brightness-95">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    )
}

export default Daashboard;
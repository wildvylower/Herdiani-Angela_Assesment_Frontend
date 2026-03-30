import '../index.css'
import { FaEdit, FaTrashAlt } from 'react-icons/fa'

function Table({ tableData, loading, onEdit, onDelete }) {
    return (
        <div className="min-w-full bg-white border border-gray-200 shadow-md p-2 rounded-xl overflow-x-auto">
            <table className="min-w-full bg-white rounded-t-lg overflow-hidden">
                <thead className="bg-[#4D8066]">
                    <tr className="text-[#FEFBF8] text-base md:text-xl lg:text-2xl">
                        <th className="px-6 py-3 text-left border-r border-[#FEFBF8]">Package Name</th>
                        <th className="px-6 py-3 text-left border-r border-[#FEFBF8]">Description</th>
                        <th className="px-6 py-3 text-left border-r border-[#FEFBF8]">Price</th>
                        <th className="px-6 py-3 text-center border-r border-[#FEFBF8]">Duration</th>
                        <th className="px-6 py-3 text-center">Action</th>
                    </tr>
                </thead>
                <tbody className="text-base md:text-lg lg:text-xl">
                    {loading ? (
                        <tr><td colSpan="5" className="text-center py-10">Memuat data...</td></tr>
                    ) : tableData.length > 0 ? (
                        tableData.map((item, index) => (
                            <tr key={item.id_banner_ads_package || index} className="border-b hover:bg-emerald-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900 border-r border-gray-200">{item.package_name}</td>
                                <td className="px-6 py-4 text-gray-600 border-r border-gray-200">{item.package_description}</td>
                                <td className="px-6 py-4 font-bold text-[#4D8066] border-r border-gray-200">Rp {item.package_price?.toLocaleString('id-ID')}</td>
                                <td className="px-6 py-4 text-gray-500 text-center border-r border-gray-200">{item.package_duration} Hari</td>
                                <td className="px-6 py-4 text-center">
                                    <div className="flex justify-center gap-4">
                                        <button onClick={() => onEdit(item)} className="hover:scale-110 transition-all"><FaEdit size={22} color='#4D8066' /></button>
                                        <button onClick={() => onDelete(item.id_banner_ads_package)} className="hover:scale-110 transition-all"><FaTrashAlt size={22} color="#C75454" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="5" className="text-center py-10 text-gray-400 italic">Data kosong.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default Table;
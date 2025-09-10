import { useEffect, useState } from 'react';
import { Select, DatePicker } from 'antd';
import { getCatVehicule, getDestination, getServiceDemandeur, getVehicule } from '../../../../../../services/charroiService';
import { CalendarOutlined, CarOutlined, TeamOutlined, FlagOutlined } from '@ant-design/icons';
import './filterBs.scss';

const { RangePicker } = DatePicker;

const FilterBs = ({ onFilter }) => {
    const [selectedVehicule, setSelectedVehicule] = useState([]);
    const [selectedService, setSelectedService] = useState([]);
    const [selectedDestination, setSelectedDestination] = useState([]);
    const [selectedCat, setSelectedCat] = useState([]);
    const [vehicule, setVehicule] = useState([]);
    const [service, setService] = useState([]);
    const [destination, setDestination] = useState([]);
    const [catVehicule, setCatVehicule] = useState([]);
    const [dateRange, setDateRange] = useState([]);

    const fetchData = async () => {
        try {
            const [serviceData, vehiculeData, destinationData, catData] = await Promise.all([
                getServiceDemandeur(),
                getVehicule(),
                getDestination(),
                getCatVehicule()
            ]);
            setService(serviceData.data);
            setVehicule(vehiculeData.data.data);
            setDestination(destinationData.data);
            setCatVehicule(catData.data);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        onFilter({
            service: selectedService,
            destination: selectedDestination,
            vehicule: selectedVehicule,
            type: selectedCat,
            dateRange: dateRange
        });
    }, [selectedService, selectedDestination, selectedVehicule, selectedCat, dateRange]);

    return (
        <div className="filterBs">
            <div className="filter_card">
                <label><TeamOutlined /> Service :</label>
                <Select
                    mode="multiple"
                    showSearch
                    style={{ width: '100%' }}
                    options={service.map(item => ({
                        value: item.id_service_demandeur,
                        label: item.nom_service,
                    }))}
                    placeholder="Sélectionnez un ou plusieurs services"
                    optionFilterProp="label"
                    onChange={setSelectedService}
                    value={selectedService}
                    allowClear
                    dropdownStyle={{ borderRadius: 12 }}
                />
            </div>

            <div className="filter_card">
                <label><CarOutlined /> Véhicule :</label>
                <Select
                    mode="multiple"
                    showSearch
                    style={{ width: '100%' }}
                    options={vehicule.map(item => ({
                        value: item.id_vehicule,
                        label: `${item.nom_marque} / ${item.immatriculation}`
                    }))}
                    placeholder="Sélectionnez un ou plusieurs véhicules"
                    optionFilterProp="label"
                    onChange={setSelectedVehicule}
                    value={selectedVehicule}
                    allowClear
                    dropdownStyle={{ borderRadius: 12 }}
                />
            </div>

            <div className="filter_card">
                <label><CarOutlined /> Type :</label>
                <Select
                    mode="multiple"
                    showSearch
                    style={{ width: '100%' }}
                    options={catVehicule.map(item => ({
                        value: item.id_cat_vehicule,
                        label: `${item.	abreviation}`
                    }))}
                    placeholder="Sélectionnez un ou plusieurs types"
                    optionFilterProp="label"
                    onChange={setSelectedCat}
                    value={selectedCat}
                    allowClear
                    dropdownStyle={{ borderRadius: 12 }}
                />
            </div>

            <div className="filter_card">
                <label><FlagOutlined /> Destination :</label>
                <Select
                    mode="multiple"
                    showSearch
                    style={{ width: '100%' }}
                    options={destination.map(item => ({
                        value: item.id_destination,
                        label: item.nom_destination,
                    }))}
                    placeholder="Sélectionnez une ou plusieurs destinations"
                    optionFilterProp="label"
                    onChange={setSelectedDestination}
                    value={selectedDestination}
                    allowClear
                    dropdownStyle={{ borderRadius: 12 }}
                />
            </div>

            <div className="filter_card">
                <label><CalendarOutlined /> Date :</label>
                <RangePicker
                    style={{ width: '100%' }}
                    value={dateRange}
                    onChange={setDateRange}
                    allowClear
                    format="DD/MM/YYYY"
                    placeholder={['Date début', 'Date fin']}
                />
            </div>
        </div>
    );
};

export default FilterBs;

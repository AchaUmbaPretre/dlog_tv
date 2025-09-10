import { DatePicker, Select } from 'antd';
import './mouvementFilter.scss';
import { useEffect, useState } from 'react';
import {
  getCatVehicule,
  getDestination,
  getServiceDemandeur,
  getVehicule
} from '../../../../../../../services/charroiService';
import { getDepartement } from '../../../../../../../services/departementService';

const { Option } = Select;
const { RangePicker } = DatePicker;

const MouvementFilter = ({ onFilter }) => {
  const [dateFilter, setDateFilter] = useState('today');
  const [selectedVehicule, setSelectedVehicule] = useState([]);
  const [selectedService, setSelectedService] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState([]);
  const [selectedType, setSelectedType] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [vehicules, setVehicules] = useState([]);
  const [services, setServices] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [types, setTypes] = useState([]);
  const [department, setDepartment] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          serviceData,
          vehiculeData,
          destinationData,
          typeData,
          departmentData
        ] = await Promise.all([
          getServiceDemandeur(),
          getVehicule(),
          getDestination(),
          getCatVehicule(),
          getDepartement(),
          getCatVehicule()

        ]);

        setServices(serviceData.data);
        setVehicules(vehiculeData.data.data);
        setDestinations(destinationData.data);
        setTypes(typeData.data);
        setDepartment(departmentData.data);

      } catch (error) {
        console.error('Erreur lors du chargement des filtres :', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (onFilter) {
      onFilter({
        dateFilter,
        dateRange,
        selectedVehicule,
        selectedService,
        selectedDestination,
        type :selectedType,
        selectedDepartment
      });
    }
  }, [
    dateFilter,
    dateRange,
    selectedVehicule,
    selectedService,
    selectedDestination,
    selectedType,
    selectedDepartment,
    onFilter,
  ]);

  return (
    <div className="mouv_card">
      {/* Période */}
      <div className="mouv_periode">
        <label className="mouv_labe">Période :</label>
        <Select
          value={dateFilter}
          onChange={setDateFilter}
          style={{ width: '100%' }}
        >
          <Option value="today">Aujourd'hui</Option>
          <Option value="yesterday">Hier</Option>
          <Option value="last7days">7 derniers jours</Option>
          <Option value="last30days">30 derniers jours</Option>
          <Option value="last1year">1 an</Option>
          <Option value="year">Par année</Option>
        </Select>
      </div>

      {/* Service */}
      <div className="mouv_periode">
        <label className="mouv_labe">Service :</label>
        <Select
          mode="multiple"
          showSearch
          allowClear
          placeholder="Sélectionnez un ou plusieurs services"
          options={services.map(service => ({
            value: service.id_service_demandeur,
            label: service.nom_service
          }))}
          value={selectedService}
          onChange={setSelectedService}
          style={{ width: '100%' }}
          optionFilterProp="label"
        />
      </div>

      {/* Véhicule */}
      <div className="mouv_periode">
        <label className="mouv_labe">Véhicule :</label>
        <Select
          mode="multiple"
          showSearch
          allowClear
          placeholder="Sélectionnez un ou plusieurs véhicules"
          options={vehicules.map(veh => ({
            value: veh.id_vehicule,
            label: veh.immatriculation
          }))}
          value={selectedVehicule}
          onChange={setSelectedVehicule}
          style={{ width: '100%' }}
          optionFilterProp="label"
        />
      </div>

      {/* Destination */}
      <div className="mouv_periode">
        <label className="mouv_labe">Destination :</label>
        <Select
          mode="multiple"
          showSearch
          allowClear
          placeholder="Sélectionnez une ou plusieurs destinations"
          options={destinations.map(dest => ({
            value: dest.id_destination,
            label: dest.nom_destination
          }))}
          value={selectedDestination}
          onChange={setSelectedDestination}
          style={{ width: '100%' }}
          optionFilterProp="label"
        />
      </div>

      {/* Type */}
      <div className="mouv_periode">
        <label className="mouv_labe">Type :</label>
        <Select
          mode="multiple"
          showSearch
          allowClear
          placeholder="Sélectionnez un ou plusieurs types"
          options={types.map(type => ({
            value: type.id_cat_vehicule,
            label: type.abreviation
          }))}
          value={selectedType}
          onChange={setSelectedType}
          style={{ width: '100%' }}
          optionFilterProp="label"
        />
      </div>

{/*       <div className="mouv_periode">
        <label className="mouv_labe">Département :</label>
        <Select
          mode="multiple"
          showSearch
          allowClear
          placeholder="Sélectionnez un ou plusieurs département"
          options={department.map(type => ({
            value: type.id_departement,
            label: type.nom_departement
          }))}
          value={selectedDepartment}
          onChange={setSelectedDepartment}
          style={{ width: '100%' }}
          optionFilterProp="label"
        />
      </div> */}

      {/* Date personnalisée */}
      <div className="mouv_periode">
        <label className="mouv_labe">Date :</label>
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

export default MouvementFilter;

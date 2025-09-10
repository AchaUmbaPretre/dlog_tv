import { Card, Tabs } from 'antd';
import { FileTextOutlined, SwapOutlined, BarChartOutlined, ContainerOutlined, SyncOutlined } from '@ant-design/icons';
import './rapportBs.scss';
import { useState } from 'react';
import PerformanceOp from './performance_op/Performance_op';
import SuiviStatutBs from './suiviStatutBs/SuiviStatutBs';
import IndicateursLog from './Indicateurs_log/Indicateurs_log';
import VolumeGlobal from './volumeGlobal/VolumeGlobal';
import MouvementVehicule from './mouvementVehicule/MouvementVehicule';

const { TabPane } = Tabs;

const RapportBs = () => {
  const [activeKey, setActiveKey] = useState('1');

  const tabItems = 
  [
    {
      key: '1',
      label: 'Volume global des activités',
      icon: FileTextOutlined,
    },
    {
      key: '2',
      label: 'Performance opérationnelle',
      icon: BarChartOutlined,
    },
    {
      key: '3',
      label: 'Suivi des statuts',
      icon: SyncOutlined,
    },
    {
      key: '4',
      label: 'Indicateurs logistiques spécifiques',
      icon: ContainerOutlined,
    },
    {
      key: '5',
      label: 'Mouvements véhicules',
      icon: SwapOutlined,
    },
  ];

  return (
    <div className="rapport_bs">
      <Card bordered={false} className="rapport_bs_card">
        <h2 className="rapport_h2">RAPPORT SORTIES VEHICULES</h2>
        <Tabs 
          activeKey={activeKey} 
          onChange={setActiveKey} 
          type="card" 
          tabPosition="top"
          tabBarGutter={24}
          className="rapport_tabs"
        >
          {tabItems.map(({ key, label, icon: Icon }) => (
          <TabPane
            key={key}
            tab={
              <span
                className={`custom_tab_label ${activeKey === key ? 'active' : ''}`}
              >
                <Icon
                  style={{
                    fontSize: 18,
                    marginRight: 8,
                    color: activeKey === key ? '#1890ff' : '#8c8c8c',
                    transition: 'color 0.3s',
                  }}
                />
                <span>{label}</span>
              </span>
            }
          >
            {key === '1' && <VolumeGlobal /> }
            {key === '2' && <PerformanceOp />}
            {key === '3' && <SuiviStatutBs />}
            {key === '4' && <IndicateursLog />}
            {key === '5' && <MouvementVehicule />}
          </TabPane>
        ))}
        </Tabs>
      </Card>
    </div>
  );
};

export default RapportBs;

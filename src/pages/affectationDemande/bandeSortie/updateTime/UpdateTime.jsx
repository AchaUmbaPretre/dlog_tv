import React, { useEffect, useState } from 'react';
import { Form, DatePicker, Button, Row, Col, Card, message } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import moment from 'moment';
import { getVehiculeCourseOne, putBonSortieUpdateDate } from '../../../../../services/charroiService';
import { useSelector } from 'react-redux';

const UpdateTime = ({ closeModal, fetchData, id_bon }) => {
  const [form] = Form.useForm();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const userId = useSelector((state) => state.user?.currentUser?.id_utilisateur);

  const fetchBonData = async () => {
    try {
      const response = await getVehiculeCourseOne(id_bon);
      const record = response?.data?.[0];

      if (record) {
        setData(record);
        form.setFieldsValue({
          sortie_time: record.sortie_time ? moment(record.sortie_time) : null,
          retour_time: record.retour_time ? moment(record.retour_time) : null,
        });
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      message.error("Impossible de charger les données.");
    }
  };

  useEffect(() => {
    if (id_bon) {
      fetchBonData();
    }
  }, [id_bon]);


  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      const loadingKey = 'updateTimeKey';
      message.loading({ content: 'Mise à jour en cours...', key: loadingKey, duration: 0 });
      setLoading(true);

      await putBonSortieUpdateDate({
        id_bon,
        sortie_time: values.sortie_time?.format('YYYY-MM-DD HH:mm:ss'),
        retour_time: values.retour_time?.format('YYYY-MM-DD HH:mm:ss'),
        user_cr: userId,
      });

      message.success({ content: 'La date a été mise à jour avec succès.', key: loadingKey });
      form.resetFields();
      fetchData(); // Rafraîchit la liste des bons
      closeModal();
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      message.error("Échec de la mise à jour de la date.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="controle_form">
      <div className="controle_title_rows">
        <div className="controle_h2">Modifier la date et l'heure</div>
      </div>

      <div className="controle_wrapper">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Card>
            <Row gutter={12}>
              <Col xs={24} md={12}>
                <Form.Item
                  label="Date & heure de départ"
                  name="sortie_time"
                  rules={[{ required: true, message: "Veuillez fournir la date et l'heure de départ" }]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                    placeholder="Choisir date et heure"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  label="Date & heure de retour prévue"
                  name="retour_time"
                  dependencies={['sortie_time']}
                  rules={[
                    { required: true, message: "Veuillez fournir la date et l'heure de retour" },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const sortieTime = getFieldValue('sortie_time');
                        if (!value || !sortieTime) return Promise.resolve();

                        if (value.isAfter(sortieTime)) {
                          return Promise.resolve();
                        }

                        return Promise.reject(new Error("La date de retour doit être postérieure à la date de départ."));
                      }
                    })
                  ]}
                >
                  <DatePicker
                    style={{ width: '100%' }}
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                    placeholder="Choisir date et heure"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={8} style={{ display: 'flex', alignItems: 'flex-end' }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SendOutlined />}
                  loading={loading}
                  disabled={loading}
                >
                  Soumettre
                </Button>
              </Col>
            </Row>
          </Card>
        </Form>
      </div>
    </div>
  );
};

export default UpdateTime;
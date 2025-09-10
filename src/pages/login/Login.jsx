import React, { useState } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './login.scss';
import { useNavigate } from 'react-router-dom';
import { login } from '../../redux/apiCalls';
import { useDispatch } from 'react-redux';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values) => {
    setIsLoading(true);

    try {
      await login(dispatch, values, navigate);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="login_wrapper">
        <div className="login_header">
          <h2>Se connecter</h2>
        </div>
        <Form
          name="login_form"
          className="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Veuillez entrer votre email!' }]}
          >
            <Input
              prefix={<UserOutlined className="site_form_item_icon" />}
              placeholder="Email Address"
              size="large"
              autoComplete="off"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Veuillez entrer votre mot de passe !' }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site_form_item_icon" />}
              placeholder="Mot de passe"
              size="large"
              autoComplete="new-password"
            />
          </Form.Item>
          <Form.Item className="login_footer">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox className="login_remember_me">Souviens-toi de moi</Checkbox>
            </Form.Item>
            <a className="login_form_forgot" href="/password_forgot">
              Mot de passe oublié ?
            </a>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login_form_button"
              size="large"
              block
              loading={isLoading}
            >
              Se connecter
            </Button>
          </Form.Item>
        </Form>
        <div className="login_footer_note">
          Vous n'avez pas de compte ? <a href="/register">Inscrivez-vous ici</a>
        </div>
      </div>
    </div>
  );
};

export default Login;

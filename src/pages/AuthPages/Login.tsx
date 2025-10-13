
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";
import LoginForm from "../../components/auth/LoginForm";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { getAuth } from "../../utils/auth";
import Loader from "../../components/ui/loader/Loader";


export default function Login() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const { token, user } = getAuth();

    if (token && user) {
      setIsLoading(true);
      navigate(`/${user?.role?.toLowerCase()}-dashboard`, { replace: true });
    }else{
      setIsLoading(false);
      navigate(`/login`, { replace: true });
    }
  }, [navigate]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <PageMeta
        title="HRMS | Carnia Softlabs"
        description="HRMS"
      />
      <AuthLayout>
        <LoginForm />
      </AuthLayout>
    </>
  );
}

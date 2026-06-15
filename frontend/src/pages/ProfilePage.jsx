import { useEffect } from "react";

import Container from "../layout/Container";
import Title from "../components/Title";
import Loading from "../components/Loading";
import { useAppContext } from "../context/AppContext";
import Address from "../components/Address";

const ProfilePage = () => {
  const { user, loadUserData, loading } = useAppContext();

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user, loadUserData]);

  if (loading) {
    return (
      <Container>
        <Loading text="Loading profile..." />
      </Container>
    );
  }

  if (!user) {
    return (
      <Container>
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-gray-500">Please login to view profile.</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="pt-14 border-t border-gray-200">
        <div className="mb-8 text-2xl">
          <Title text1="MY" text2="PROFILE" />
        </div>

        <div className="max-w-3xl p-6 border border-gray-200 rounded-md shadow-sm">
          <div className="flex items-center gap-5 mb-6">
            <div className="flex items-center justify-center w-20 h-20 text-3xl font-semibold text-white bg-black rounded-full">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {user.name}
              </h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          <div className="space-y-4 text-sm mb-8">
            <div>
              <p className="text-gray-500">Name</p>
              <p className="font-medium text-gray-800">{user.name}</p>
            </div>

            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-medium text-gray-800">{user.email}</p>
            </div>
          </div>

          <Address mode="profile" />
        </div>
      </div>
    </Container>
  );
};

export default ProfilePage;

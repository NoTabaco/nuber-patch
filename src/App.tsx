import {
  gql,
  MutationUpdaterFn,
  useLazyQuery,
  useMutation,
  useQuery,
  useReactiveVar,
} from "@apollo/client";
import { isLoggedInVar } from "./apollo";
import {
  facebookConnect,
  facebookConnectVariables,
  getDrivers,
} from "./__generated-types__";

const FACEBOOK_CONNECT = gql`
  mutation facebookConnect(
    $firstName: String!
    $lastName: String!
    $email: String
    $fbId: String!
  ) {
    FacebookConnect(
      firstName: $firstName
      lastName: $lastName
      email: $email
      fbId: $fbId
    ) {
      ok
      error
      token
    }
  }
`;

const GET_NEARBY_DRIVERS = gql`
  query getDrivers {
    GetNearbyDrivers {
      ok
      error
      drivers {
        id
        lastLat
        lastLng
      }
    }
  }
`;

function App() {
  const onCompleted = (data: facebookConnect) => {
    if (data.FacebookConnect.ok) {
    }
  };
  const update: MutationUpdaterFn<facebookConnect> = (cache, data) => {};
  const {
    data: queryData,
    error,
    loading,
    called,
    client,
  } = useQuery<getDrivers>(GET_NEARBY_DRIVERS);
  /* const [triggerQuery, { loading, error, data, called, client }] = useLazyQuery
  (GET_NEARBY_DRIVERS); */
  const [mutationFn] = useMutation<facebookConnect, facebookConnectVariables>(
    FACEBOOK_CONNECT,
    {
      variables: { firstName: "", lastName: "", email: "", fbId: "" },
      onCompleted,
    }
  );

  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const onLogIn = () => {
    isLoggedInVar(true);
  };
  const onLogOut = () => {
    isLoggedInVar(false);
  };

  return (
    <div>
      {isLoggedIn ? (
        <>
          <h3>Welcome</h3>
          <button onClick={onLogOut}>Log Out</button>
        </>
      ) : (
        <>
          <h3>Please Log In</h3>
          <button onClick={onLogIn}>Log In</button>
        </>
      )}
    </div>
  );
}

export default App;

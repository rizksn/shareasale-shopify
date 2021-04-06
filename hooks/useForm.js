import { useEffect, useState, useCallback } from "react";
import gql from "graphql-tag";
import { useQuery } from "react-apollo";

const GET_MERCHANTID = gql`
  {
    shop {
      privateMetafield(namespace: "shareasaleShopifyApp", key: "mid") {
        value
        id
      }
    }
  }
`;

const GET_MASTERTAGID = gql`
  {
    shop {
      privateMetafield(namespace: "shareasaleShopifyApp", key: "masterTagID") {
        value
        id
      }
    }
  }
`;

const useForm = () => {
  const [merchantID, setMerchantID] = useState("");
  const [masterTID, setMasterTagID] = useState("");

  const {
    loading,
    error,
    data: sasMerchantID,
    startPolling: startGetMerchantID,
    stopPolling: stopGetMerchantID,
  } = useQuery(GET_MERCHANTID);

  const {
    data: sasMasterTagID,
    startPolling: startGetMasterTagID,
    stopPolling: stopGetMasterTagID,
  } = useQuery(GET_MASTERTAGID);

  useEffect(() => {
    startGetMerchantID(100);
    startGetMasterTagID(100);
    if (sasMerchantID)
      try {
        sasMerchantID.shop.privateMetafield == null
          ? ""
          : handleMerchantIDChange(sasMerchantID.shop.privateMetafield.value);
      } catch (e) {
        console.log(e);
      }
    if (sasMasterTagID)
      try {
        sasMasterTagID.shop.privateMetafield == null
          ? ""
          : handleMasterTagIDChange(sasMasterTagID.shop.privateMetafield.value);
      } catch (e) {
        console.log(e);
      }
    stopGetMerchantID();
    stopGetMasterTagID();
  }, [sasMerchantID && sasMasterTagID !== undefined]);

  const handleMerchantIDChange = useCallback(
    (newValue) => setMerchantID(newValue),
    [merchantID]
  );

  const handleMasterTagIDChange = useCallback(
    (newValue) => setMasterTagID(newValue),
    [masterTID]
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{`Error: ${error.message}`}</p>;

  return {
    merchantID,
    handleMerchantIDChange,
    masterTID,
    handleMasterTagIDChange,
  };
};

export default useForm;

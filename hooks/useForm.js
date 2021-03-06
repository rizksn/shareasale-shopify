import { useEffect, useState, useCallback } from "react";
import gql from "graphql-tag";
import { useMutation, useQuery } from "react-apollo";

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

  const handleMerchantIDChange = useCallback(
    (newValue) => setMerchantID(newValue),
    [merchantID]
  );

  const handleMasterTagIDChange = useCallback(
    (newValue) => setMasterTagID(newValue),
    [masterTID]
  );

  return {
    merchantID,
    handleMerchantIDChange,
    masterTID,
    handleMasterTagIDChange,
  };
};

export default useForm;

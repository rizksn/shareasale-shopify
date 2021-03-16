import processOrder from "./processOrder";
import getOrder from "./getOrder";
import voidOrder from "./voidOrder";
import editOrder from "./editOrder";
import getAccountByShop from "./getAccountByShop";
import deleteAccountByShop from "./deleteAccountByShop";
import getAccountByMerchantID from "./getAccountByMerchantID";
import addShop from "./addShop";
import updateMerchantID from "./updateMerchantID";
import addTagsToOrder from "./addTagsToOrder";

const shareasale = {
  processOrder,
  getOrder,
  voidOrder,
  editOrder,
  getAccountByShop,
  deleteAccountByShop,
  getAccountByMerchantID,
  addShop,
  updateMerchantID,
  addTagsToOrder,
};

export default shareasale;

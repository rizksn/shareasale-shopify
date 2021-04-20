import React, { useEffect, useState } from "react";
import { useQuery } from "react-apollo";
import { Page, Layout, EmptyState, Card, Spinner } from "@shopify/polaris";
import gql from "graphql-tag";
import { CSVLink } from "react-csv";
const os = require("os");

const Datafeed = () => {
  const [data, setData] = useState([{ dataProducts: [] }]);

  const [download, setDownload] = useState("");

  const { loading: notReady, data: shopQuery } = useQuery(gql`
    query {
      shop {
        primaryDomain {
          id
          url
        }
        myshopifyDomain
      }
    }
  `);

  useEffect(() => {
    if (!notReady) {
      getProducts();
    }
  }, [!notReady && shopQuery !== undefined]);

  useEffect(() => {
    if (notReady) {
      setDownload("downloading...");
    }
    if (!notReady && shopQuery !== undefined) {
      setDownload("Download Datafeed");
    }
  });

  const csvData = [
    [
      "SKU",
      "Name",
      "URL to product",
      "Price",
      "Retail Price",
      "URL to image",
      "URL to thumbnail image",
      "Commission",
      "Category",
      "SubCategory",
      "Description",
      "Search Terms",
      "Status",
      "Merchant ID",
      "Custom 1",
      "Custom 2",
      "Custom 3",
      "Custom 4",
      "Custom 5",
      "Manufacturer",
      "PartNumber",
      "MerchantCategory",
      "MerchantSubcategory",
      "ShortDescription",
      "ISBN",
      "UPC",
      "CrossSell",
      "MerchantGroup",
      "MerchantSubgroup",
      "CompatibleWith",
      "CompareTo",
      "QuantityDiscount",
      "Bestseller",
      "AddToCartURL",
      "ReviewsRSSURL",
      "Option1",
      "Option2",
      "Option3",
      "Option4",
      "Option5",
      "customCommissions",
      "customCommissionIsFlatRate",
      "customCommissionNewCustomerMultiplier",
      "mobileURL",
      "mobileImage",
      "mobileThumbnail",
      "ReservedForFutureUse",
      "ReservedForFutureUse",
      "ReservedForFutureUse",
      "ReservedForFutureUse",
    ],
  ];

  if (notReady) {
    return (
      <Page>
        <Layout>
          <Spinner />
        </Layout>
      </Page>
    );
  }

  let primaryDomain = shopQuery.shop.primaryDomain.url;
  console.log(primaryDomain);

  const getProducts = async () => {
    const getShopData = await fetch(`https://${os.hostname()}/api/settings/`, {
      method: "POST",
      body: JSON.stringify({ shop: shopQuery.shop.myshopifyDomain }),
    });
    const shopData = await getShopData.json();
    const MID = shopData.merchantID;

    // const getProductData = await fetch("https://allbirds.com/products.json");
    const getProductData = await fetch(`${primaryDomain}/products.json`);
    const productData = await getProductData.json();

    console.log(productData);

    try {
      for (let i = 0; i < productData.products.length; i++) {
        // if (a.products[i].variants) {
        for (let j = 0; j < productData.products[i].variants.length; j++) {
          var array = [];
          // SKU
          array.push(productData.products[i].variants[j].sku);
          // Name
          array.push(productData.products[i].title);
          // URL to Product
          array.push(`${primaryDomain}/${productData.products[i].handle}`);
          // Price
          array.push(productData.products[i].variants[j].price);
          // Retail Price
          array.push("");
          // URL to Image
          productData.products[i].variants[j].featured_image == null
            ? array.push(productData.products[i].images[0].src)
            : array.push(productData.products[i].variants[j].featured_image);
          // URL to Thumbnail Image
          productData.products[i].variants[j].featured_image == null
            ? array.push(productData.products[i].images[1].src)
            : array.push(productData.products[i].variants[j].featured_image);
          // Commission
          array.push("");
          // Category
          array.push(1);
          // SubCategory
          array.push(1);
          // Description
          array.push(
            productData.products[i].body_html.replaceAll(
              /(<.*?>)|(<\/.*?>)/g,
              ""
            )
          );
          // Search Terms
          array.push("");
          // Status
          array.push("");
          // MerchantID
          array.push(MID);

          csvData.push(array);
        }
      }
      setData(csvData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Page title="ShareASale Shopify Tracker" narrowWidth>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <EmptyState
              heading="ShareASale Datafeed"
              secondaryAction={{
                content: "Learn more",
                url:
                  "https://shareasale.atlassian.net/wiki/spaces/SAS/pages/395542579/Datafeeds",
              }}
              image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
            >
              <p>Download your Shopify product datafeed</p>
              <br />
              <br />
              <CSVLink
                id="CSVLink"
                data={data}
                style={{
                  background: "linear-gradient(to bottom, #6371c7, #5563c1)",
                  height: "100%",
                  width: "100%",
                  textDecoration: "none",
                  color: "#fff",
                  backgroundColor: "#5c6ac4",
                  position: "relative",
                  minHeight: "4.6rem",
                  minWidth: "12rem",
                  maxWidth: "18rem",
                  display: "inline-flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: 0,
                  padding: "0.7rem 1.6rem",
                  borderRadius: "3px",
                  boxShadow:
                    "inset 0 1px 0 0 #6774c8, 0 1px 0 0 rgb(22 29 37 / 5%), 0 0 0 0 transparent",
                }}
              >
                {download}
              </CSVLink>
            </EmptyState>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Datafeed;

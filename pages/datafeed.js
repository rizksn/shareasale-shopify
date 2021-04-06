import React, { useState, useCallback, useEffect } from "react";
import { useQuery } from "react-apollo";
import {
  Page,
  Layout,
  EmptyState,
  Card,
  Button,
  Spinner,
} from "@shopify/polaris";
import gql from "graphql-tag";
import { CSVLink } from "react-csv";
import useForm from "../hooks/useForm";

const Datafeed = () => {
  const [data, setData] = useState([{ dataProducts: [] }]);

  const { loading: notReady, data: shopQuery } = useQuery(gql`
    query {
      shop {
        primaryDomain {
          id
          url
        }
      }
    }
  `);

  const { merchantID } = useForm();

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

  const getProducts = async () => {
    var productData = await fetch("https://allbirds.com/products.json");
    // var productData = await fetch(`https://${shopDomain}/products.json`);

    var a = await productData.json();

    try {
      for (let i = 0; i < a.products.length; i++) {
        // if (a.products[i].variants) {
        for (let j = 0; j < a.products[i].variants.length; j++) {
          var array = [];
          // SKU
          array.push(a.products[i].variants[j].sku);
          // Name
          array.push(a.products[i].title);
          // URL to Product
          array.push(`${primaryDomain}/${a.products[i].handle}`);
          // Price
          array.push(a.products[i].variants[j].price);
          // Retail Price
          array.push("");
          // URL to Image
          a.products[i].variants[j].featured_image == null
            ? array.push(a.products[i].images[0].src)
            : array.push(a.products[i].variants[j].featured_image);
          // URL to Thumbnail Image
          a.products[i].variants[j].featured_image == null
            ? array.push(a.products[i].images[1].src)
            : array.push(a.products[i].variants[j].featured_image);
          // Commission
          array.push("");
          // Category
          array.push(1);
          // SubCategory
          array.push(1);
          // Description
          array.push(
            a.products[i].body_html.replaceAll(/(<.*?>)|(<\/.*?>)/g, "")
          );
          // Search Terms
          array.push("");
          // Status
          array.push("");
          // MerchantID
          array.push(merchantID);

          csvData.push(array);
        }
      }
      setData(csvData);
    } catch (error) {
      console.log(error);
    }
  };

  if (!notReady) {
    getProducts();
  }

  return (
    <Page narrowWidth>
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
              {/* <Button primary style={{ margin: "0", padding: "0" }}> */}
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
                  "justify-content": "center",
                  alignItems: "center",
                  margin: 0,
                  padding: "0.7rem 1.6rem",
                  "border-radius": "3px",
                  "box-shadow":
                    "inset 0 1px 0 0 #6774c8, 0 1px 0 0 rgb(22 29 37 / 5%), 0 0 0 0 transparent",
                }}
              >
                Download Datafeed
              </CSVLink>
              {/* </Button> */}
            </EmptyState>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default Datafeed;

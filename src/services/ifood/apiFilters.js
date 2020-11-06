import axios from "axios";

const fetchApiFilters = () => {
  const url = "http://www.mocky.io/v2/5a25fade2e0000213aa90776";

  const config = {
    method: "GET",
    url,
  };

  return axios(config);
};

export default fetchApiFilters;

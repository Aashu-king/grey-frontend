import axiosInstance from "../axios.setup";

class ProductService {
    GetProductList = async () => {
        const respose = await axiosInstance.get('/products')
        return respose.data
    }

    GetParticularProduct = async (id : number) => {
        console.log('id: ', id);
        const respose = await axiosInstance.get(`/products/${id}`)
        return respose.data
    }
}

const ProductServiceInstance = new ProductService()
export default ProductServiceInstance;
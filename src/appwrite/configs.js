import config from "../config/config";
import {Client,ID,Databases,Storage,Query} from "appwrite";

export class Service{
     client = new Client();
     databases;
     bucket;
     constructor(){
        this.client
        .setEndpoint(config.appwriteUrl)
        .setProject(config.appwriteProjectId);
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);

     }
     async createPost({title,slug,content,featuredImage,status,userId}){
        try{
           return await this.databases.createDocument(
            config.appwriteDatabaseId,config.appwriteCollectionId,slug,
            {
                title,content,featuredImage,status,userId,
            }
           )
        }catch(error){
            console.log("Appwrite service :: createPost :: error",error);
        }
     }
     async updatePost(slug,{title,content,featuredImage,status}){
        try{
            return await this.databases.updateDocument(config.appwriteDatabaseId,config.appwriteCollectionId,slug),{
                title,
                content,
                featuredImage,
                status,
            }

        }catch(error){
            console.log("Appwrite service :: updatePost :: error",error);

        }
     }
     async deletePost(slug){
           try {
            this.databases.deleteDocument(config.appwriteDatabaseId,config.appwriteCollectionId,slug);
        return true;   } catch (error) {
            console.log("Appwrite service :: deletePost :: error",error);
             return false;
           }
     }
     async getPost(slug){
        try {
            return await this.databases.getDocument(config.appwriteDatabaseId,config.appwriteCollectionId,slug);
        } catch (error) {
            console.log("Appwrite service :: getPost :: error",error);

        }
     }
     async getPosts(queries = [Query.equal("status","active")]){
           try {
            return await this.databases.listDocuments(
                config.appwriteDatabaseId,config.appwriteCollectionId,queries,
                // [Query.equal("status","active")] we can use this aswell
            )
           } catch (error) {
            console.log("Appwrite service :: getPosts :: error",error);
            return false;

           }
     }
    //  file upload service
    async uploadFile(file){
         try {
            return await this.bucket.createFile(
                config.appwriteBucketId,
                ID.unique(),
                file
            )
         } catch (error) {
            console.log("Appwrite service :: uploadfile :: error",error);
 return false;
         }
    }
    async deletFile(fileId){
        try {
           return await this.bucket.deleteFile(
               config.appwriteBucketId,
               fileId
           )
           return true;
        } catch (error) {
           console.log("Appwrite service :: deletefile :: error",error);
return false;
        }
   }
//    file preview is very fast so
   getFile(fileId){
       return this.bucket.getFilePreview(
        config.appwriteBucketId,
        fileId
       )
   }


}
const service = new Service();
export default service
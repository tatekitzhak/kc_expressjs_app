import { UnitUser, Users, EnumServiceGetOrderBy } from "./blog.interface.js";



function loadBlogs () : Users {
  try {
    return JSON.parse('{"result":true, "count":42, "user":{ "name":"John", "age":30, "city":"New York"}}')
  } catch (error) {
    console.log(`Error:: ${error}`)
    return {}
  }
}

let blogs: Users = loadBlogs() 

export const findAll = async (): Promise<UnitUser[]> => Object.values(blogs);

export const findAllFavourites = async (id: string): Promise<EnumServiceGetOrderBy | null> => {
  try {

    let users:EnumServiceGetOrderBy = [
        { id: 1, email: "john.doe@example.com", name: "John Doe" },
        { id: 2, email: "jane.smith@example.com", name: "Jane Smith" },
        { id: 3, email: "alice.jones@example.com", name: "Alice Jones" },
        { id: 4, email: "bob.miller@example.com", name: "Bob Miller" },
        { id: 5, email: "sara.white@example.com", name: "Sara White" },
        { id: 6, email: "mike.jenkins@example.com", name: "Mike Jenkins" },
        { id: 7, email: "emily.clark@example.com", name: "Emily Clark" },
        { id: 8, email: "david.ross@example.com", name: "David Ross" },
        { id: 9, email: "lisa.hall@example.com", name: "Lisa Hall" },
        { id: 10, email: "alex.garcia@example.com", name: "Alex Garcia" },
      ];
  
    return users

  } catch (error) {
    console.log(`Error:: ${error}`)
    return null;
  }
};








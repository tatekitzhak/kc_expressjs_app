export const queryAggregationPipeline = (subcategoryBlog: string) => {
    
    const aggregatPipelineLookup = [
        {
          $lookup: {
            from: subcategoryBlog,
            localField: "subcategory_ref_ids",
            foreignField: "_id",
            // let: { customer_id: "$_id" }, // Define the local variable to use in the pipeline
            pipeline: [
              // { $match: { $expr: { $eq: ["$customerId", "$$customer_id"] } } },
              { 
                $lookup: {
                from: "topic",
                localField: "topic_ref_ids",
                foreignField: "_id",
                pipeline: [
                    // { $match: { $expr: { $eq: ["$customerId", "$$customer_id"] } } },
                    { 
                      $lookup: {
                      from: "article",
                      localField: "article_ref_ids",
                      foreignField: "_id",
                      as: "blogArticle"
                    },
                  },
                    {
                      $unwind: {
                        path: "$blogArticle",
                        preserveNullAndEmptyArrays: true
                      }
                    },
                    {
                      $group: {
                        "_id": {
                          _id: "$_id",
                          topicTitle: "$title",
                          description: "$description"
                        },
                        "blogArticle": { "$push": "$blogArticle" }
                      }
                    }
                  ],

                as: "blogTopic"
              },
            },
              {
                $unwind: {
                  path: "$blogTopic",
                  preserveNullAndEmptyArrays: true
                }
              },
              {
                $group: {
                  "_id": {
                    _id: "$_id",
                    subcategoryTitle: "$title",
                    description: "$description"
                  },
                  "blogTopic": { "$push": "$blogTopic" }
                }
              }
            ],
            as: "blogSubcategory"
          }
        },
        {
          $unwind: {
            path: "$blogSubcategory",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $group: {
            "_id": {
              _id: "$_id",
              categoryTitle: "$title",
              description: "$description"
            },
            "blogSubcategory": { "$push": "$blogSubcategory" }
          }
        }
      ];
    
    return aggregatPipelineLookup;
  }
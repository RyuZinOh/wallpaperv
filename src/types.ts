//image structure
export interface Thumbnail {
  name: string;
  thumbURL: string;
  fullURL: string;
}

/*
Representing a file returned by github API
- filename 
- download  
*/
export interface GitHubFile {
  name: string;
  download_url: string;
}

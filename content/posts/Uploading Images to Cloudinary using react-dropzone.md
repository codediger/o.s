---
author: "Orinami Olatunji"
date: 2018-02-25
title: Uploading Images to Cloudinary using react-dropzone
type: "post"

tags: [
  "react", "javascript", "npm packages"
]
---

Recently, I was trying to add `upload images form field` to a project I am working on and I found it really difficult to get along with the cloudinary documentation and the other React cloudinary tutorials I came across. While searching for alternatives, I was able to find a react package `react-dropzone` which worked perfectly for me, prompting me to write this tutorial on how to upload images to cloudinary for anyone that might need it.

## Getting Started
I'm assuming you have a React project already set up and you're just trying to figure out how to handle image uploads. So let's go straight to the point. In this tutorial, we are going to be needing two packages, `axios` - a robust promise http library and `react-dropzone` for handling our image upload to cloudinary. Install these using the command below:

```shell
npm install axios react-dropzone --save
```
After downloading both packages successfully, we can now start writing the code to handle our image upload. Before writing code, let's setup cloudinary and retrieve some vital information.

## Cloudinary Setup
Create an account on [cloudinary](https://cloudinary.com). If you already have one, then retrieve your `Cloud name` `API key` and `Image upload URL` from your management console. We also need retrieve our `preset` and enable unsigned uploading from the account settings.

To retrieve our preset, we'd have to go to the `management console > settings > upload tab`, then we'd scroll down till we see something like this:

{{% img "https://res.cloudinary.com/orinami/image/upload/v1519571583/Screen_Shot_2018-02-25_at_4.08.35_PM_fettjn.png" %}}

Now, we have all we need to continue. Let's create our image upload component.

## Creating the Component
Here's the code. Replace this in your App.js file if you created a new project or replace it wherever needed.
```javascript
import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import Dropzone from 'react-dropzone'
import axios from 'axios'

class App extends Component {
  // This function does the uploading to cloudinary
  handleUploadImages = images => {
    // uploads is an array that would hold all the post methods for each image to be uploaded, then we'd use axios.all()
    const uploads = images.map(image => {
      // our formdata
      const formData = new FormData();
      formData.append("file", image);
      formData.append("tags", '{TAGS}'); // Add tags for the images - {Array}
      formData.append("upload_preset", "{YOUR_PRESET}"); // Replace the preset name with your own
      formData.append("api_key", "{YOUR_API_KEY}"); // Replace API key with your own Cloudinary API key
      formData.append("timestamp", (Date.now() / 1000) | 0);

      // Replace cloudinary upload URL with yours
      return axios.post(
        "https://api.cloudinary.com/v1_1/{CLOUD_NAME}/image/upload",
        formData, 
        { headers: { "X-Requested-With": "XMLHttpRequest" }})
        .then(response => console.log(response.data))
    });

    // We would use axios `.all()` method to perform concurrent image upload to cloudinary.
    axios.all(uploads).then(() => {
      // ... do anything after successful upload. You can setState() or save the data
      console.log('Images have all being uploaded')
    });
  }

  render() {
    return (
      <Dropzone
        onDrop={this.handleUploadImages}
        multiple
        accept="image/*"
      >
      Try dropping some files here, or click to select files to upload.
      </Dropzone>
    )
  }


  ReactDOM.render(
    <App />,
    document.getElementById('root')
  );
}

export default App
```

You should see something like this when you run your React project: 

{{% img 
"https://res.cloudinary.com/orinami/image/upload/v1519581098/Screen_Shot_2018-02-25_at_6.51.03_PM_ohi5f3.png" %}}

That's all. You can try uploading images. Just click the component and it would open a dialog for you to select files that you want to upload. After that you can check your browser console to see the response and check on cloudinary `cloudinary management console > media` to find the images you uploaded there. Feel free to customize it to suit your needs. 

You can read more about `react-dropzone` [here](https://react-dropzone.js.org/) to know the other props that you can make available to the Dropzone Component.

Thank you for reading. I hope I was able to help you. :)

import { useState } from "react"
import "emoji-mart/css/emoji-mart.css"
import { Emoji, Picker } from "emoji-mart"

const CoverGrid = () => {
  const [emojis, setEmojis] = useState<{ colons: string, native: string }[]>([
    { colons: ':pregnant_woman:', native: '🤰'},
    { colons: ':pregnant_woman:', native: '🤰'},
    { colons: ':pregnant_woman:', native: '🤰'},
    { colons: ':pregnant_woman:', native: '🤰'},
    { colons: ':pregnant_woman:', native: '🤰'},
    { colons: ':pregnant_woman:', native: '🤰'},
    { colons: ':pregnant_woman:', native: '🤰'},
    { colons: ':pregnant_woman:', native: '🤰'},
    { colons: ':pregnant_woman:', native: '🤰'},
    { colons: ':pregnant_woman:', native: '🤰'},
    { colons: ':pregnant_woman:', native: '🤰'},
    { colons: ':pregnant_woman:', native: '🤰'},
  ])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
    // const newEmojis: string[] = [...emojis]

    // newEmojis[index] = event.target.value

    // setEmojis(newEmojis)
  }
  

  const executeRequest = () => {
    console.log(emojis)
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(emojis)
    }

    fetch("/api/generate-cover", requestOptions)    
      .then( async (res) => {
        // link.href = URL.createObjectURL(
        //   new Blob([res.data], { type: "video/mp4" })
        // );
        // link.click();
        const json = await res.json()
        // const url = window.URL.createObjectURL(new Blob([json]))
        // console.log(url)
        // const link = document.createElement("a")
        // link.href = url
        // link.setAttribute("download", "file.png")
        // document.body.appendChild(link)
        // link.click()        

        const link = document.createElement("a");
        link.target = "_blank";
        link.download = "file.png"
        link.href = URL.createObjectURL(
          new Blob([json], { type: "image/png" })
        );
        link.click();      
      })
      .catch((e) => console.log(e))
  }

  return (
    <div className="grid-body">
      <div className="emoji-grid">
        {/* {emojis.map((emoji, key) => (
          <div key={key}>
            <input value={emoji} onChange={(e) => handleChange(e, key)} />
            <Emoji emoji={emoji.id} size={64} />
            <Picker />
          </div>
        ))} */}
        <Emoji emoji={emojis[0].colons} size={64} />
        <Picker />
      </div>
      <div className="button">
        <button onClick={() => executeRequest()}>Download cover</button>
      </div>
    </div>
  )
}

export default CoverGrid

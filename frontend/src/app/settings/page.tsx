
import "../chat/page.css"


const LeaderBord = () =>{
  return (
    <div className="text-black  w-full h-[100%] bg-white ">

        <div className=" flex w-full h-[50%] justify-center items-end  bg-white gap-[0.5rem] pb-[20px]">

          <div className=" w-[25%] h-[70%]  flex flex-col items-center  rounded-[10px]  bg-gray-100">
            <img className="w-[60%] rounded-[50%] border-[4px] border-amber-900 mt-[0.4rem]" src="https://cdn.intra.42.fr/users/850b847e468af56ad89bba61d7918cb8/zlaksyar.jpg"/>
            <h1 className="pt-[0.5rem]">zalaksya</h1>
            <h1 className="pt-[0.4rem]">524</h1>
          </div>
          <div className=" w-[25%] h-[80%]  flex flex-col items-center  rounded-[10px] bg-gray-100">
            <img className="w-[60%] rounded-[50%] border-[4px] border-amber-400 mt-[0.4rem]" src="https://cdn.intra.42.fr/users/850b847e468af56ad89bba61d7918cb8/zlaksyar.jpg"/>
            <h1 className="pt-[0.5rem]">zalaksya</h1>
            <h1 className="pt-[0.4rem]">524</h1>
          </div>
          <div className=" w-[25%] h-[70%]  flex flex-col items-center  rounded-[10px] bg-gray-100">
            <img className="w-[60%] rounded-[50%] border-[4px] border-gray-400 mt-[0.4rem]" src="https://cdn.intra.42.fr/users/850b847e468af56ad89bba61d7918cb8/zlaksyar.jpg"/>
            <h1 className="pt-[0.5rem]">zalaksya</h1>
            <h1 className="pt-[0.4rem]">524</h1>
          </div>

        </div>

        <div className="w-full h-[50%] ">
            <div className="flex justify-end">
              <div className="rank w-[4%] bg-green-300 self-center flex"><p className="text-3xl">3</p></div>
              <div className="w-[95%] flex full h-[6rem] bg-gray-100 justify-between">
                <div className="bg-amber-600 w-[40%] h-full"></div>
                <div className="bg-amber-600 w-[20%] h-full"></div>
              </div>
            </div>
        </div>
   </div>

  );
};







export default function SettingsPage() {
  return (
    <div className="text-white w-[25%] h-[40%]">
      <LeaderBord/>
    </div>
  );
}

import Image from "next/image";

const WorkCard = ({ num, title, text, img }) => {
  return (
    <div className="w-[90%] sm:w-4/5 mx-auto md:mx-0 md:w-full flex flex-col md:gap-5 gap-5 text-center md:text-left">
      <span className="md:mx-0 mx-auto text-3xl w-fit font-bold text-blue-600 bg-white rounded-full py-4 px-4">
        {num}
      </span>
      {img && (
        <Image
          src={img}
          width={205}
          height={300}
          alt="arrow"
          className="hidden absolute top-7 left-[4.8rem] xl:block rotate"
        />
      )}
      <h2 className="text-xl font-bold leading-relaxed">
        {title}
      </h2>
      <p className="leading-loose">
        {text}
      </p>
    </div>
  );
};

const Work = ({ title1 , title2 , title3 , title4 , text1 , text2 , text3 , text4 }) => {
  return (
    <section className="w-full bg-blue-600 text-white mt-4  bg-center">
      <div className="flex flex-col gap-10 lg:gap-16 container mx-auto md:px-16 px-5 py-12 sm:py-20 md:py-20">
        <div>
          <span className="uppercase block font-semibold text-md tracking-widest text-center text-white">
            WHATS THE FUNCTION
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold my-3 text-center ">
            Let&apos;s see how it works
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-25">
          <div className="relative">
            <WorkCard num="01" img={"/images/arrow.svg"} title={title1} text={text1} />
          </div>
          <div className="relative">
            <WorkCard num="02" img={"/images/arrow.svg"} title={title2} text={text2} />
          </div>
          <div className="relative">
            <WorkCard num="03" img={"/images/arrow.svg"} title={title3} text={text3} />
          </div>
          <div className="relative">
            <WorkCard num="04" title={title4} text={text4} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Work;

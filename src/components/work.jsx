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

const Work = ({ titlesmall , titlebig , title1, title2, title3, title4, text1, text2, text3, text4 }) => {
  return (
    <section className="w-full bg-blue-600 text-white mt-2 bg-center">
      <div className="flex flex-col gap-4 lg:gap-6 container mx-auto md:px-8 px-2 py-4 sm:py-8 md:py-8">
        <div>
          <span className="uppercase block font-semibold text-sm tracking-widest text-center text-white">
            {titlesmall}
          </span>
          <h2 className="text-xl sm:text-2xl font-bold my-1 text-center">
          {titlebig}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10 ">
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

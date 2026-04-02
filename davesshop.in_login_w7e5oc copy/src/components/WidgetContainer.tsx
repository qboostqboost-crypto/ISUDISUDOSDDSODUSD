export const WidgetContainer = () => {
  return (
    <div className="box-border caret-transparent">
      <div className="fixed shadow-[rgb(128,128,128)_0px_0px_5px_0px] box-border caret-transparent h-[60px] right-[-186px] w-64 overflow-hidden rounded-sm bottom-3.5">
        <div className="box-border caret-transparent">
          <iframe
            title="reCAPTCHA"
            role="presentation"
            name="a-kg243env8wzp"
            src="https://www.google.com/recaptcha/api2/anchor?ar=1&k=6LeRgYsrAAAAAB-CBhA_QjS1AxSXW-8_zfyOQFTI&co=aHR0cHM6Ly9kYXZlc3Nob3AuaW46NDQz&hl=en&v=qm3PSRIx10pekcnS9DjGnjPW&size=invisible&anchor-ms=20000&execute-ms=30000&cb=rynv4atmnxio"
            className="box-border caret-transparent h-[60px] w-64"
          ></iframe>
        </div>
        <div className="box-border caret-transparent"></div>
        <textarea
          name="g-recaptcha-response"
          className="appearance-none box-border caret-transparent hidden h-10 resize-none w-[250px] border-stone-300 overflow-visible mx-[25px] my-2.5 p-0"
        ></textarea>
      </div>
      <iframe className="box-border caret-transparent hidden"></iframe>
    </div>
  );
};

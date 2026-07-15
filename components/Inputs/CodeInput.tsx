'use client'
import React, {useState, useRef, useEffect, useEffectEvent} from 'react'

type Props = {
  setUserCode : (e:string[]) => void,
}

const CodeInput = ({setUserCode} : Props) => {

  // dupa ce introduce o cifra in fiecare input, focusul se muta automat pe urmatorul input
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const [code, setCode] = useState<string[]>(Array(6).fill(''));

  useEffect(() => {
    setUserCode(code);
  }, [code])
  

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const index = inputRefs.current.indexOf(input);

    if (e.key === 'Backspace' && code[index] === '') {
      if (index > 0) {
        const prevInput = inputRefs.current[index - 1];
        if (prevInput) {
          prevInput.focus();
        }
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const value = input.value;

    if (/^\d$/.test(value)) { // verificam daca valoarea introdusa este un numar
      const index = inputRefs.current.indexOf(input);
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
    }

    // stergem valoarea daca utilizatorul apasa backspace
    if (value === '') {
      const index = inputRefs.current.indexOf(input);
      const newCode = [...code];
      newCode[index] = '';
      setCode(newCode);
      return;
    }

    // nu mai putem introduce mai mult de un caracter in fiecare input
    if (value.length > 1) {
      input.value = value.charAt(0);
    }


    // mutam focusul pe urmatorul input
    const nextInput = inputRefs.current[inputRefs.current.indexOf(input) + 1];
    if (nextInput) {
      nextInput.focus();
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* un sir de 6 patrate input fiecare cu scopul de introducere a cate unui caracter din cod */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="__"
          className="box_input"
          ref={(el) => {
            if (el) {
              inputRefs.current[0] = el;
            }
          }}
          onKeyDown={handleKeyDown}
          onChange={handleInputChange}
        />
        <input
          type="text"
          placeholder="__"
          className="box_input"
          ref={(el) => {
            if (el) {
              inputRefs.current[1] = el;
            }
          }}
          onKeyDown={handleKeyDown}
          onChange={handleInputChange}
        />
        <input
          type="text"
          placeholder="__"
          className="box_input"
          ref={(el) => {
            if (el) {
              inputRefs.current[2] = el;
            }
          }}
          onKeyDown={handleKeyDown}
          onChange={handleInputChange}
        />
        <input
          type="text"
          placeholder="__"
          className="box_input"
          ref={(el) => {
            if (el) {
              inputRefs.current[3] = el;
            }
          }}
          onKeyDown={handleKeyDown}
          onChange={handleInputChange}
        />
        <input
          type="text"
          placeholder="__"
          className="box_input"
          ref={(el) => {
            if (el) {
              inputRefs.current[4] = el;
            }
          }}
          onKeyDown={handleKeyDown}
          onChange={handleInputChange}
        />
        <input
          type="text"
          placeholder="__"
          className="box_input"
          ref={(el) => {
            if (el) {
              inputRefs.current[5] = el;
            }
          }}
          onKeyDown={handleKeyDown}
          onChange={handleInputChange}
        />
      </div>
    </div>
  )
}

export default CodeInput
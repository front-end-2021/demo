export function rmCommentsAndLines(sourceCode) {
  let cleanCode = "";
  let i = 0;
  let state = "NORMAL";

  let isLineEmptySoFar = true;
  let currentLineBuffer = "";

  // --- BƯỚC 1: XÓA COMMENT VÀ XÓA DÒNG CHỨA COMMENT ---
  while (i < sourceCode.length) {
    const char = sourceCode[i];
    const nextChar = sourceCode[i + 1] || "";

    if (char === '\n' || char === '\r') {
      if (state === "NORMAL") {
        currentLineBuffer += char;
        cleanCode += currentLineBuffer;
      } else if (state === "SINGLE_COMMENT") {
        if (!isLineEmptySoFar) {
          cleanCode += currentLineBuffer + char;
        }
        state = "NORMAL";
      }
      currentLineBuffer = "";
      isLineEmptySoFar = true;
      i++;
      continue;
    }

    switch (state) {
      case "NORMAL":
        if (char === '/' && nextChar === '/') {
          state = "SINGLE_COMMENT";
          i += 2;
          continue;
        }
        else if (char === '/' && nextChar === '*') {
          state = "MULTI_COMMENT";
          i += 2;
          continue;
        }
        else if ((char === '@' && nextChar === '"') || (char === '$' && nextChar === '@' && sourceCode[i + 2] === '"')) {
          state = "VERBATIM_STRING";
          let strPrefix = (char === '$') ? '$@"' : '@"';
          currentLineBuffer += strPrefix;
          isLineEmptySoFar = false;
          i += strPrefix.length;
          continue;
        }
        else if (char === '"') {
          state = "STRING";
        }

        if (char !== ' ' && char !== '\t') {
          isLineEmptySoFar = false;
        }
        currentLineBuffer += char;
        break;

      case "SINGLE_COMMENT":
        break;

      case "MULTI_COMMENT":
        if (char === '*' && nextChar === '/') {
          state = "NORMAL";
          i += 2;
          continue;
        }
        break;

      case "STRING":
        currentLineBuffer += char;
        isLineEmptySoFar = false;
        if (char === '\\') {
          currentLineBuffer += nextChar;
          i += 2;
          continue;
        } else if (char === '"') {
          state = "NORMAL";
        }
        break;

      case "VERBATIM_STRING":
        currentLineBuffer += char;
        isLineEmptySoFar = false;
        if (char === '"' && nextChar === '"') {
          currentLineBuffer += nextChar;
          i += 2;
          continue;
        } else if (char === '"') {
          state = "NORMAL";
        }
        break;
    }
    i++;
  }
  if (state === "NORMAL") {
    cleanCode += currentLineBuffer;
  } else if (state === "SINGLE_COMMENT" && !isLineEmptySoFar) {
    cleanCode += currentLineBuffer;
  }

  // --- BƯỚC 2: GỘP NHIỀU DÒNG TRỐNG (KỂ CẢ CÓ KHOẢNG TRẮNG) THÀNH 1 DÒNG TRỐNG ---
  // Giải thích Regex:
  // (\r?\n)         : Dòng trống đầu tiên
  // (?:[ \t]*\r?\n) : Các dòng tiếp theo có thể chứa khoảng trắng hoặc tab, lặp lại ít nhất 1 lần (+)
  return cleanCode.replace(/(\r?\n)(?:[ \t]*\r?\n)+/g, '$1$1'); // Thay thế bằng $1$1 để giữ lại duy nhất 1 dòng trống sạch sẽ giữa các khối code.
}

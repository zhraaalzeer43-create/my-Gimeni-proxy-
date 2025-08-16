const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async function(event, context) {
  // 1. التأكد من أن الطلب هو POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    // 2. قراءة المكونات من الطلب
    const body = JSON.parse(event.body);
    const ingredients = body.ingredients;

    if (!ingredients) {
      return { statusCode: 400, body: JSON.stringify({ error: "No ingredients provided" }) };
    }

    // 3. إعداد Gemini باستخدام مفتاحك السري
    // سنضع المفتاح في Netlify لاحقاً، وليس هنا في الكود
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // 4. إنشاء الطلب وإرساله إلى Gemini
    const prompt = `اقترح وصفة طعام مفصلة باللغة العربية باستخدام المكونات التالية فقط: ${ingredients}.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 5. إرجاع الوصفة بنجاح
    return {
      statusCode: 200,
      body: JSON.stringify({ recipe: text }),
    };

  } catch (error) {
    // 6. التعامل مع أي أخطاء
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

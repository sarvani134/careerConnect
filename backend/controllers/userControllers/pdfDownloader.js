const PDFDocument = require("pdfkit");
const fs = require("fs");
const crypto = require("crypto");

const convertUserDataIntoPdf = async (userData) => {
    return new Promise((resolve, reject) => {

        const doc = new PDFDocument({ margin: 50 });

        const outputPath = crypto.randomBytes(16).toString("hex") + ".pdf";

        const stream = fs.createWriteStream("uploads/" + outputPath);
         const education = userData.education || [];
const pastWork = userData.pastWork || [];

        doc.pipe(stream);
       const imagePath = "uploads/" + userData.userId.profilePicture;

const buffer = fs.readFileSync("uploads/default.jpg");

if (imagePath && fs.existsSync(imagePath)) {
    doc.image(imagePath, {
        fit: [120, 120],
        align: "center"
    });
}

doc.moveDown();


        doc
            .fontSize(24)
            .fillColor("blue")
            .text("USER PROFILE", {
                align: "center",
            });

        doc.moveDown();

        doc
            .fontSize(18)
            .fillColor("black")
            .text("Basic Information");

        doc.moveDown(0.5);

        doc.fontSize(12);
        doc.text(`Name : ${userData.userId.name}`);
        doc.text(`Username : ${userData.userId.username}`);
        doc.text(`Email : ${userData.userId.email}`);

        doc.moveDown();

        doc
            .fontSize(18)
            .text("Bio");

        doc.moveDown(0.5);

        doc
            .fontSize(12)
            .text(userData.bio || "No Bio");

        doc.moveDown();

        doc
            .fontSize(18)
            .text("Current Position");

        doc.moveDown(0.5);

        doc
            .fontSize(12)
            .text(userData.currPost || "Not Added");

        doc.moveDown();

        doc
            .fontSize(18)
            .text("Education");

        doc.moveDown();
       

        if (education === 0) {
            doc.fontSize(12).text("No Education Added");
        } else {
            education.forEach((edu, index) => {
                doc.fontSize(14).text(`Education ${index + 1}`);
                doc.fontSize(12);
                doc.text(`School : ${edu.school}`);
                doc.text(`Degree : ${edu.degree}`);
                doc.text(`Field Of Study : ${edu.fieldOfStudy}`);
                doc.moveDown();
            });
        }

        doc
            .fontSize(18)
            .text("Work Experience");

        doc.moveDown();

        if (pastWork === 0) {
            doc.fontSize(12).text("No Experience Added");
        } else {
            pastWork.forEach((company, index) => {
                doc.fontSize(14).text(`Company ${index + 1}`);
                doc.fontSize(12);
                doc.text(`Company : ${company.company}`);
                doc.text(`Position : ${company.position}`);
                doc.text(`Years : ${company.years}`);
                doc.moveDown();
            });
        }

        doc.end();

        stream.on("finish", () => {
            resolve(outputPath);
        });

        stream.on("error", (err) => {
            reject(err);
        });

    });
};

module.exports=convertUserDataIntoPdf

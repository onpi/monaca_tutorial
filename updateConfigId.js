const fs = require('fs-extra');
const xml2js = require('xml2js');
const path = require('path');
const dotenv = require('dotenv');

// 環境変数からビルド環境を取得
const env = process.env.BUILD_ENV || 'dev';

// 環境に応じた.envファイルを読み込む
const envPath = path.join(__dirname, `.env.${env}`);
dotenv.config({ path: envPath });

// 環境に応じた新しいidを.envファイルから取得
const newId = process.env.APP_ID || 'com.example.app';

// config.xmlのパス
const configPath = path.join(__dirname, 'config.xml');

async function updateConfigId() {
  try {
    // config.xmlファイルの読み込み
    const configXml = await fs.readFile(configPath, 'utf-8');
    // XMLをJavaScriptオブジェクトに変換
    xml2js.parseString(configXml, async (err, result) => {
      if (err) {
        throw err;
      }

      // id属性の更新
      result.widget.$.id = newId;

      // JavaScriptオブジェクトをXMLに戻す
      const builder = new xml2js.Builder();
      const updatedXml = builder.buildObject(result);

      // 更新されたconfig.xmlを保存
      await fs.writeFile(configPath, updatedXml);
      console.log(`config.xml has been updated with id: ${newId}`);
    });
  } catch (error) {
    console.error('Failed to update config.xml:', error);
  }
}

updateConfigId();
